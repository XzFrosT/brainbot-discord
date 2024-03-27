export const Common: {
	[k: string]: string;
} = {
	Accepted: "@0: Accepted.",
	Created: "@0: Created.",
	Deleted: "@0: Deleted",
	DoesNotExist: "@0: @1 Does Not Exist.",
	Found: "@0: Found.",
	InternalServerError: "@0: Internal Server Error.",
	NotFound: "@0: Not Found.",
	NotSupported: "@0: @1 Is Not Supported Method.",
	Unauthorized: "@0: Unauthorized.",
	QueryParamsLength: "@0: @1 Query/Params Must Be Atleast @2 Long."
}

export const Database: {
	[k: string]: string;
} = {
	AlreadyExist: "@0: Already Exist.",
	FailedToCreate: "@0: Failed To Create Requested Record.",
	RecordCreated: "@0: Record Created.",
	RecordDeleted: "@0: Record Deleted.",
	RecordUpdated: "@0: Record Updated."
}

export const Cache: {
	[k: string]: string;
} = {
	GreaterThanOneTtl: "@0: The ttl must be higher than 1."
}