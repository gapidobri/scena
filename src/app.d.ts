declare namespace App {
	interface Locals {
		session?: import('@ory/kratos-client').Session;
		userId: string | null;
		cookie?: string;
	}
	// interface PageData {}
	// interface Platform {}
}
