declare namespace App {
	interface Locals {
		session?: import('@ory/kratos-client').Session;
		userId: string | null;
	}
	// interface PageData {}
	// interface Platform {}
}
