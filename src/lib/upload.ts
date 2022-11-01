/* eslint-disable @typescript-eslint/no-empty-function */

type UploaderOptions = {
	chunkSize?: number;
	threadsQuantity?: number;
	file: File;
	fileName: string;
};

type Part = {
	signedUrl: string;
	PartNumber: number;
};

type UploadedPart = {
	PartNumber: number;
	ETag: string;
};

type PartsRes = {
	parts: Part[];
};

type Progress = {
	sent: number;
	total: number;
	percentage: number;
};

export class Uploader {
	private readonly chunkSize: number;
	private readonly threadsQuantity: number;
	private readonly file: File;
	private readonly fileName: string;

	private aborted = false;
	private uploadedSize = 0;
	private progressCache: Record<number, number> = {};
	private activeConnections: Record<number, XMLHttpRequest> = {};
	private parts: Part[] = [];
	private uploadedParts: UploadedPart[] = [];
	private fileId: string | null = null;
	private fileKey: string | null = null;

	private onProgressFn: (progress: Progress) => void = () => {};
	private onErrorFn: (error: Error) => void = () => {};

	constructor(options: UploaderOptions) {
		this.chunkSize = options.chunkSize ?? 1024 * 1024 * 5;
		this.threadsQuantity = Math.min(options.threadsQuantity ?? 5, 15);
		this.file = options.file;
		this.fileName = options.fileName;
	}

	start() {
		this.initialize();
	}

	private async initialize() {
		let fileName = this.fileName;
		const ext = this.file.name.split('.').pop();
		if (ext) {
			fileName += `.${ext}`;
		}

		const initRes = await fetch('/upload/initialize', {
			method: 'POST',
			body: JSON.stringify({ name: fileName }),
		});

		const initJson = await initRes.json();
		this.fileId = initJson.fileId;
		this.fileKey = initJson.fileKey;

		const numberOfParts = Math.ceil(this.file.size / this.chunkSize);

		const urlsRes = await fetch('/upload/urls', {
			method: 'POST',
			body: JSON.stringify({
				fileId: this.fileId,
				fileKey: this.fileKey,
				parts: numberOfParts,
			}),
		});
		const urlsJson: PartsRes = await urlsRes.json();

		this.parts.push(...urlsJson.parts);

		this.sendNext();
	}

	private sendNext() {
		const activeConnections = Object.keys(this.activeConnections).length;
		if (activeConnections >= this.threadsQuantity) {
			return;
		}

		if (!this.parts.length) {
			if (!activeConnections) {
				this.complete();
			}
			return;
		}

		const part = this.parts.pop();
		if (this.file && part) {
			const sentSize = (part.PartNumber - 1) * this.chunkSize;
			const chunk = this.file.slice(sentSize, sentSize + this.chunkSize);

			const sendChunkStarted = () => {
				this.sendNext();
			};

			this.sendChunk(chunk, part, sendChunkStarted)
				.then(() => {
					this.sendNext();
				})
				.catch((error: Error) => {
					this.parts.push(part);
					this.complete(error);
				});
		}
	}

	private async complete(error?: Error) {
		if (error && !this.aborted) {
			this.onErrorFn(error);
			return;
		}

		if (error) {
			this.onErrorFn(error);
			return;
		}

		await this.sendCompleteRequest();
	}

	private async sendCompleteRequest() {
		if (this.fileId && this.fileKey) {
			await fetch('/upload/finalize', {
				method: 'POST',
				body: JSON.stringify({
					fileId: this.fileId,
					fileKey: this.fileKey,
					parts: this.uploadedParts,
				}),
			});
		}
	}

	private sendChunk(chunk: Blob, part: Part, sendChunkStarted: () => void) {
		return new Promise<void>((resolve, reject) => {
			this.upload(chunk, part, sendChunkStarted)
				.then((status) => {
					if (status !== 200) {
						reject(new Error('Failed chunk upload'));
						return;
					}
					resolve();
				})
				.catch(reject);
		});
	}

	private handleProgress(part: number, event: ProgressEvent<XMLHttpRequestEventTarget>) {
		if (this.file) {
			if (event.type === 'progress' || event.type === 'error' || event.type === 'abort') {
				this.progressCache[part] = event.loaded;
			}

			if (event.type === 'uploaded') {
				this.uploadedSize += this.progressCache[part] || 0;
				delete this.progressCache[part];
			}

			const inProgress = Object.keys(this.progressCache)
				.map(Number)
				.reduce((memo, id) => (memo += this.progressCache[id]), 0);

			const sent = Math.min(this.uploadedSize + inProgress, this.file.size);
			const total = this.file.size;
			const percentage = Math.round((sent / total) * 100);

			this.onProgressFn({ sent, total, percentage });
		}
	}

	private upload(blob: Blob, part: Part, sendChunkStarted: () => void) {
		return new Promise((resolve, reject) => {
			if (this.fileId && this.fileKey) {
				const xhr = (this.activeConnections[part.PartNumber - 1] = new XMLHttpRequest());
				sendChunkStarted();

				const progressListener = this.handleProgress.bind(this, part.PartNumber - 1);

				xhr.upload.addEventListener('progress', progressListener);

				xhr.addEventListener('error', progressListener);
				xhr.addEventListener('abort', progressListener);
				xhr.addEventListener('loadend', progressListener);

				xhr.open('PUT', part.signedUrl);

				xhr.onreadystatechange = () => {
					if (xhr.readyState === 4 && xhr.status === 200) {
						const ETag = xhr.getResponseHeader('ETag');
						console.log(xhr.getAllResponseHeaders());

						if (ETag) {
							const uploadedPart = {
								PartNumber: part.PartNumber,
								ETag: ETag.replaceAll('"', ''),
							};

							this.uploadedParts.push(uploadedPart);

							resolve(xhr.status);
							delete this.activeConnections[part.PartNumber - 1];
						}
					}
				};

				xhr.onerror = (error) => {
					reject(error);
					delete this.activeConnections[part.PartNumber - 1];
				};

				xhr.onabort = () => {
					reject(new Error('Upload canceled by user'));
					delete this.activeConnections[part.PartNumber - 1];
				};

				xhr.send(blob);
			}
		});
	}

	public onProgress(onProgress: (progress: Progress) => void) {
		this.onProgressFn = onProgress;
		return this;
	}

	public onError(onError: (error: Error) => void) {
		this.onErrorFn = onError;
		return this;
	}

	public abort() {
		Object.keys(this.activeConnections)
			.map(Number)
			.forEach((id) => {
				this.activeConnections[id].abort();
			});

		this.aborted = true;
	}
}
