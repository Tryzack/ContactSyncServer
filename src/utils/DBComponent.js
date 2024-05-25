import pg from "pg";
import { queries } from "./queries.js";
import dotenv from "dotenv";

dotenv.config();

let USERS = [];

async function connect() {
	try {
		const client = new pg.Client({
			user: process.env.DB_USERNAME,
			host: process.env.DB_HOST,
			database: process.env.DB_NAME,
			password: process.env.DB_PASSWORD,
			port: process.env.DB_PORT,
		});

		await client.connect();
		return client;
	} catch (error) {
		console.error("Error connecting to the database");
		console.error(error);
		return null;
	}
}

/**
 * Get all users
 * @returns {Array} - Array of users
 */
async function getUsers() {
	try {
		const client = await connect();
		if (!client) return null;
		const result = await client.query(queries.select.getUsers);
		client.end();
		return result.rows;
	} catch (error) {
		console.error(error);
	}
}

/**
 * Get user by email
 * @param {string} email - User email
 * @returns
 */
async function getUserByEmail(email) {
	try {
		const client = await connect();
		if (!client) return null;
		const result = await client.query(queries.select.getUserByEmail, [email]);
		client.end();
		return result.rows[0];
	} catch (error) {
		console.error(error);
		return null;
	}
}

/**
 * Get contacts
 * @param {number} userId - User id
 * @returns {Array} - Array of contacts
 */
async function getContacts(userId) {
	try {
		const client = await connect();
		if (!client) return null;
		const result = await client.query(queries.select.getContacts, [userId]);
		client.end();
		return result.rows;
	} catch (error) {
		console.error(error);
		return [];
	}
}
/**
 * Get contact by id
 * @param {number} userId - User id
 * @param {number} contactId - Contact id
 * @returns {Object} - Contact object
 */
async function getContactById(userId, contactId) {
	try {
		const client = await connect();
		if (!client) return null;
		const result = await client.query(queries.select.getContactById, [contactId, userId]);
		client.end();
		return result.rows[0];
	} catch (error) {
		console.error(error);
		return {};
	}
}

/**
 * Get contact phone numbers
 * @param {number} userId - User id
 * @param {number} contactId - Contact id
 * @returns {Array} - Array of phone numbers
 */
async function getContactPhone(userId, contactId) {
	try {
		const client = await connect();
		if (!client) return null;
		const result = await client.query(queries.select.getContactPhone, [contactId, userId]);
		client.end();
		return result.rows;
	} catch (error) {
		console.error(error);
		return [];
	}
}

/**
 * Get contact emails
 * @param {number} userId - User id
 * @param {number} contactId - Contact id
 * @returns {Array} - Array of emails
 */
async function getContactEmail(userId, contactId) {
	try {
		const client = await connect();
		if (!client) return null;
		const result = await client.query(queries.select.getContactEmail, [contactId, userId]);
		client.end();
		return result.rows;
	} catch (error) {
		console.error(error);
		return [];
	}
}

/**
 * Get contact URLs
 * @param {number} userId - User id
 * @param {number} contactId - Contact id
 * @returns {Array} - Array of URLs
 */
async function getContactURL(userId, contactId) {
	try {
		const client = await connect();
		if (!client) return null;
		const result = await client.query(queries.select.getContactURL, [contactId, userId]);
		client.end();
		return result.rows;
	} catch (error) {
		console.error(error);
		return [];
	}
}

/**
 * Get contact dates
 * @param {number} userId - User id
 * @param {number} contactId - Contact id
 * @returns {Array} - Array of dates
 */
async function getContactDate(userId, contactId) {
	try {
		const client = await connect();
		if (!client) return null;
		const result = await client.query(queries.select.getContactDate, [contactId, userId]);
		client.end();
		return result.rows;
	} catch (error) {
		console.error(error);
		return [];
	}
}

/**
 * Get groups
 * @param {number} userId - User id
 * @returns {Array} - Array of groups
 */
async function getGroups(userId) {
	try {
		const client = await connect();
		if (!client) return null;
		const result = await client.query(queries.select.getGroups, [userId]);
		client.end();
		return result.rows;
	} catch (error) {
		console.error(error);
		return [];
	}
}

/**
 * get contacts by group
 * @param {number} userId - User id
 * @param {number} groupId - Group id
 * @returns {Array} - Array of contacts in the group
 */
async function getContactByGroups(userId, groupId) {
	try {
		const client = await connect();
		if (!client) return null;
		const result = await client.query(queries.select.getContactsByGroup, [userId, groupId]);
		client.end();
		return result.rows;
	} catch (error) {
		console.error(error);
		return [];
	}
}

/**
 * Get all contacts and groups
 * @param {number} userId - User id
 * @returns {Array} - Array of contacts and groups
 */
async function getAllContactsAndGroups(userId) {
	try {
		const client = await connect();
		if (!client) return null;
		const contactsAndGroups = await client.query(queries.select.getContactGroups, [userId]);
		client.end();
		return { contacts: contactsAndGroups.rows };
	} catch (error) {
		console.error(error);
		return [];
	}
}

/**
 * Insert a new user
 * @param {string} email - User email (required)
 * @param {string} password - User password (required)
 * @returns {number} - User id
 * @returns {boolean} - False if there was an error
 */
async function insertUser(email, password) {
	try {
		const client = await connect();
		if (!client) return false;
		const lastUser = USERS.length - 1;
		let id;
		if (lastUser < 0) {
			id = 1;
		} else {
			id = USERS[lastUser][0] + 1;
		}
		await client.query(queries.insert.insertUser, [id, email, password]);
		client.end();
		USERS.push([id, email]);
		return id;
	} catch (error) {
		console.error(error);
		return false;
	}
}

/**
 * Insert a new group
 * @param {number} userId - User id / comes from the session
 * @param {string} groupName - Group name (required)
 * @param {string} groupDescription - Group description
 */
async function insertGroup(userId, groupName, groupDescription) {
	try {
		const client = await connect();
		if (!client) return false;
		const id = await client.query(queries.select.getMaxGroupId, [userId]);
		await client.query(queries.insert.insertGroup, [
			id.rows[0].max ? id.rows[0].max + 1 : 1,
			userId,
			groupName,
			groupDescription ? groupDescription : "",
		]);
		client.end();
		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
}

/**
 * Insert a new contact into a group
 * @param {number} userId - User id / comes from the session
 * @param {number} contactId - Contact id
 * @param {number} groupId - Group id
 * @returns
 */
async function insertContactGroup(userId, contactId, groupId) {
	try {
		const client = await connect();
		if (!client) return false;
		await client.query(queries.insert.insertContactGroup, [userId, contactId, groupId]);
		client.end();
		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
}

/**
 * Insert a new contact
 * @param {number} userId - User id / comes from the session
 * @param {string} firstName - Contact first name (required)
 * @param {string} lastName - Contact last name
 * @param {string} contactAlias - Contact alias
 * @param {string} company - Contact company
 * @param {string} address - Contact address
 */
async function insertContact(userId, firstName, lastName, contactAlias, company, address) {
	try {
		const client = await connect();
		if (!client) return false;
		const id = await client.query(queries.select.getMaxContactId, [userId]);
		await client.query(queries.insert.insertContact, [
			id.rows[0].max ? id.rows[0].max + 1 : 1,
			userId,
			firstName,
			lastName ? lastName : "",
			contactAlias ? contactAlias : "",
			company ? company : "",
			address ? address : "",
		]);
		client.end();
		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
}

/**
 * Insert a new phone number for a contact
 * @param {number} id - Phone id
 * @param {number} userId - User id / comes from the session
 * @param {number} contactId - Contact id
 * @param {number} phoneType - Phone type
 * @param {number} phoneCode - Country code
 * @param {number} phoneNumber - Phone number
 * @returns
 */
async function insertContactPhone(userId, contactId, phoneType, phoneCode, phoneNumber) {
	try {
		const client = await connect();
		if (!client) return false;
		const id = await client.query(queries.select.getMaxContactPhoneId, [contactId, userId]);
		await client.query(queries.insert.insertContactPhone, [id.rows[0].max + 1 || 1, userId, contactId, phoneType, phoneCode, phoneNumber]);
		client.end();
		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
}

/**
 * Insert a new email for a contact
 * @param {number} id - Email id
 * @param {number} userId - User id / comes from the session
 * @param {number} contactId - Contact id
 * @param {number} emailType - Email type
 * @param {string} emailDirection - Email direction
 */

async function insertContactEmail(userId, contactId, emailType, emailDirection) {
	const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
	if (!emailRegex.test(emailDirection)) {
		throw new Error("Invalid email format");
	}

	try {
		const client = await connect();
		if (!client) return false;
		const id = await client.query(queries.select.getMaxContactEmailId, [contactId, userId]);
		await client.query(queries.insert.insertContactEmail, [id.rows[0].max + 1 || 1, userId, contactId, emailType, emailDirection]);
		client.end();
		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
}

/**
 * Insert a new date for a contact
 * @param {number} id - Date id
 * @param {number} userId - User id / comes from the session
 * @param {number} contactId - Contact id
 * @param {number} dateType - Date type
 * @param {string} contactDate - Contact date (format: yyyy-mm-dd)
 */
async function insertContactDate(userId, contactId, dateType, contactDate) {
	try {
		const client = await connect();
		if (!client) return false;
		const id = await client.query(queries.select.getMaxContactDateId, [contactId, userId]);
		await client.query(queries.insert.insertContactDate, [id.rows[0].max + 1 || 1, userId, contactId, dateType, contactDate]);
		client.end();
		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
}

/**
 * Insert a new URL for a contact
 * @param {number} userId - User id / comes from the session
 * @param {number} contactId - Contact id
 * @param {string} url - URL
 */
async function insertContactURL(userId, contactId, url) {
	try {
		const client = await connect();
		if (!client) return false;
		const id = await client.query(queries.select.getMaxContactURLId, [contactId, userId]);
		await client.query(queries.insert.insertContactURL, [id.rows[0].max + 1 || 1, userId, contactId, url]);
		client.end();
		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
}

/**
 * Update contact
 * @param {number} userId - User id / comes from the session
 * @param {number} contactId - Contact id
 * @param {string} firstName - Contact first name
 * @param {string} lastName - Contact last name
 * @param {string} contactAlias - Contact alias
 * @param {string} company - Contact company
 * @param {string} address - Contact address
 */
async function updateContact(userId, contactId, firstName = "", lastName = "", contactAlias = "", company = "", address = "") {
	try {
		const client = await connect();
		if (!client) return false;
		if (contactId === 1) {
			return false;
		}
		await client.query(queries.update.updateContact, [firstName, lastName, contactAlias, company, address, contactId, userId]);
		client.end();
		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
}

/**
 * Update contact phone
 * @param {number} id - Phone id
 * @param {number} userId
 * @param {number} contactId
 * @param {number} phoneType
 * @param {number} phoneCode
 * @param {number} phoneNumber
 */
async function updateContactPhone(id, userId, contactId, phoneType, phoneCode, phoneNumber) {
	try {
		const client = await connect();
		if (!client) return false;
		await client.query(queries.update.updateContactPhone, [phoneType, phoneCode, phoneNumber, contactId, userId, id]);
		client.end();
		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
}

/**
 * Update contact email
 * @param {number} id
 * @param {number} userId
 * @param {number} contactId
 * @param {number} emailType
 * @param {string} emailDirection
 */
async function updateContactEmail(id, userId, contactId, emailType, emailDirection) {
	try {
		const client = await connect();
		if (!client) return false;
		await client.query(queries.update.updateContactEmail, [emailType, emailDirection, contactId, userId, id]);
		client.end();
		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
}

/**
 * Update contact URL
 * @param {number} id
 * @param {number} userId
 * @param {number} contactId
 * @param {string} url
 */
async function updateContactURL(id, userId, contactId, url) {
	try {
		const client = await connect();
		if (!client) return false;
		await client.query(queries.update.updateContactURL, [url, contactId, userId, id]);
		client.end();
		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
}

/**
 * Update contact date
 * @param {number} id
 * @param {number} userId
 * @param {number} contactId
 * @param {number} dateType
 * @param {string} contactDate
 */
async function updateContactDate(id, userId, contactId, dateType, contactDate) {
	try {
		const client = await connect();
		if (!client) return false;
		await client.query(queries.update.updateContactDate, [dateType, contactDate, contactId, userId, id]);
		client.end();
		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
}
/**
 * Update group
 * @param {number} userId
 * @param {number} groupId
 * @param {string} groupName
 * @param {string} groupDescription
 */
async function updateGroup(userId, groupId, groupName, groupDescription) {
	try {
		const client = await connect();
		if (!client) return false;
		await client.query(queries.update.updateGroup, [groupName, groupDescription, userId, groupId]);
		client.end();
		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
}

/**
 * Delete contact and all its related data
 * @param {number} userId
 * @param {number} contactId
 */
async function deleteContact(userId, contactId) {
	try {
		const client = await connect();
		if (!client) return false;
		await client.query(queries.delete.deleteContactPhones, [contactId, userId]);
		await client.query(queries.delete.deleteContactEmails, [contactId, userId]);
		await client.query(queries.delete.deleteContactURLs, [contactId, userId]);
		await client.query(queries.delete.deleteContactDates, [contactId, userId]);
		await client.query(queries.delete.deleteContactFromAllGroups, [userId, contactId]);
		await client.query(queries.delete.deleteContact, [contactId, userId]);
		client.end();
		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
}
/**
 * Delete contact phone
 * @param {number} userId
 * @param {number} contactId
 * @param {number} phoneId
 */
async function deleteContactPhone(userId, contactId, phoneId) {
	try {
		const client = await connect();
		if (!client) return false;
		await client.query(queries.delete.deleteContactPhone, [contactId, userId, phoneId]);
		client.end();
		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
}

/**
 * Delete contact email
 * @param {number} userId
 * @param {number} contactId
 * @param {number} emailId
 */
async function deleteContactEmail(userId, contactId, emailId) {
	try {
		const client = await connect();
		if (!client) return false;
		await client.query(queries.delete.deleteContactEmail, [contactId, userId, emailId]);
		client.end();
		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
}

/**
 * Delete contact URL
 * @param {number} userId
 * @param {number} contactId
 * @param {number} urlId
 */
async function deleteContactURL(userId, contactId, urlId) {
	try {
		const client = await connect();
		if (!client) return false;
		await client.query(queries.delete.deleteContactURL, [contactId, userId, urlId]);
		client.end();
		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
}

/**
 * Delete contact date
 * @param {number} userId
 * @param {number} contactId
 * @param {number} dateId
 */
async function deleteContactDate(userId, contactId, dateId) {
	try {
		const client = await connect();
		if (!client) return false;
		await client.query(queries.delete.deleteContactDate, [contactId, userId, dateId]);
		client.end();
		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
}

/**
 * Delete group and all its contacts
 * @param {number} userId
 * @param {number} groupId
 */
async function deleteGroup(userId, groupId) {
	try {
		const client = await connect();
		if (!client) return false;
		await client.query(queries.delete.deleteAllContactsFromGroup, [groupId, userId]);
		await client.query(queries.delete.deleteGroup, [groupId, userId]);
		client.end();
		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
}
/**
 * Delete contact from group
 * @param {number} userId
 * @param {number} contactId
 * @param {number} groupId
 */
async function deleteContactFromGroup(userId, contactId, groupId) {
	try {
		const client = await connect();
		if (!client) return false;
		await client.query(queries.delete.deleteContactFromGroup, [contactId, groupId, userId]);
		client.end();
		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
}

getUsers().then((users) => {
	users.forEach((user) => {
		USERS.push([user.id, user.email]);
	});
});

export {
	getUsers,
	getUserByEmail,
	getContacts,
	getContactById,
	getContactPhone,
	getContactEmail,
	getContactURL,
	getContactDate,
	getGroups,
	getContactByGroups,
	getAllContactsAndGroups,
	insertUser,
	insertGroup,
	insertContactGroup,
	insertContact,
	insertContactPhone,
	insertContactDate,
	insertContactEmail,
	insertContactURL,
	updateContact,
	updateContactPhone,
	updateContactEmail,
	updateContactURL,
	updateContactDate,
	updateGroup,
	deleteContact,
	deleteContactEmail,
	deleteContactURL,
	deleteContactPhone,
	deleteContactDate,
	deleteGroup,
	deleteContactFromGroup,
};
