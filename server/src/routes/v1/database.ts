import { Request, Response, Router, json } from 'express';

import { asOwnResponse } from "../../services/own";
import { makeId } from "../../utils/functions";
import { HttpStatusCode } from "../../utils/types/http";
import { OwnResponsePayloadType } from "../../typings";
import BlacklistSchema from "../../schemas/blacklist";
import ChatSchema from "../../schemas/chat";
import ImagineSchema from "../../schemas/imagine";

const Collections: {[key: string]: any;} = {
	blacklist: BlacklistSchema,
	chat: ChatSchema,
	imagine: ImagineSchema
}

/* Route for /v1/database/{collection}/{id}?
 * if one wants to interact with the database,
 * they must do it through this route.
 * 
 * GET: get record
 * POST: create a new record
 * PATCH: update existing record
 * DELETE: remove record from database
 */

const DatabaseRoute: Router = Router();

DatabaseRoute.use(json());

/* catch all request */
DatabaseRoute.all("/:collection/:id?", async (req: Request, res: Response) => {
	var { collection, id } = req.params;
	var { many } = req.query;
	var statusCode = HttpStatusCode.OK, result, d, m, p: string[] = [];
	
	if (!Collections[collection])
	{
		statusCode = HttpStatusCode.NOT_FOUND;
		m = "Common.DoesNotExist";
		p = [collection];
	}
	else if (id && String(id).length < 12 || req.body && req.body?._id && String(req.body?._id).length < 12)
	{
		statusCode = HttpStatusCode.LENGTH_REQUIRED;
		m = "Common.QueryParamsLength" 
		p = ["id", "12 characters"];
	}
	else
	{
		var Collection = Collections[collection];
		
		switch (req.method) {
			case "GET":
				result = await Collection.findOne({ _id: id });
				if (many && many === "true") result = await Collection.find(id?{ _id: id }:{});
				
				if (result)
				{
					statusCode = HttpStatusCode.FOUND;
					m = "Common.Found"
				}
				else
				{
					statusCode = HttpStatusCode.NOT_FOUND;
					m = "Common.NotFound"
				}
				
				break;
			case "POST":
				let isExisting;
				let record = req.body;
				
				if (record?.id || record?._id) isExisting = await Collection.findOne(record?.id? {id: record?.id}: {_id: record?._id});
				else Object.defineProperty(record, "_id", {
					enumerable: true,
					value: makeId(32)
				});
				if (!isExisting) result = await new Collection(record).save();
				if (result)
				{
					statusCode = HttpStatusCode.CREATED;
					m = "Database.RecordCreated"
				}
				else
				{
					statusCode = HttpStatusCode.CONFLICT;
					m = isExisting? "Database.AlreadyExist": "Common.NotFound"
					result = isExisting? isExisting: null;
				}
				
				break;
			case "PATCH":
				result = await Collection.findOneAndUpdate({ _id: id }, req.body, {
					returnDocument: "after"
				});
				
				if (result)
				{
					statusCode = HttpStatusCode.ACCEPTED;
					m = "Database.RecordUpdated";
				}
				else
				{
					statusCode = HttpStatusCode.NOT_FOUND;
					m = "Common.NotFound";
				}
				
				break;
			case "DELETE":
				result = await Collection.findOneAndDelete({ _id: id });
				
				if (result)
				{
					statusCode = HttpStatusCode.ACCEPTED;
					m = "Database.RecordDeleted";
				}
				else
				{
					statusCode = HttpStatusCode.NOT_FOUND;
					m = "Common.NotFound";
				}
				
				break;
			default:
			  statusCode = HttpStatusCode.NOT_IMPLEMENTED;
			  m = "Common.NotSupported";
			  p = [req.method];
		}
	}
	
	if (result) d = JSON.parse(JSON.stringify(result));
	
	return res.status(statusCode).json(
		asOwnResponse([`${statusCode}`, ...p], OwnResponsePayloadType.DATABASE_QUERY, m, d)
	);
});

export default DatabaseRoute;