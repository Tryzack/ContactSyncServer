const queries = {
	select: {
		getUsers: "SELECT id, email FROM users",
		getUserByEmail: "SELECT id, email, user_password FROM users WHERE email = $1",
		getUserById: "SELECT * FROM users WHERE id = $1",
		getContacts:
			"SELECT c.id, c.first_name, c.last_name, c.contact_alias, c.color, cp.phone_code, cp.phone_number FROM contact c LEFT JOIN contact_phone cp ON c.id = cp.contact_id AND cp.id = 1 WHERE c.user_id = $1",
		getMaxContactId: "SELECT MAX(id) FROM contact WHERE user_id = $1",
		getContactById: "SELECT id, first_name, last_name, contact_alias, company, address, color FROM contact WHERE id = $1 AND user_id = $2",
		getContactPhone: " SELECT id, phone_type, phone_code, phone_number FROM contact_phone WHERE contact_id = $1 AND user_id = $2",
		getMaxContactPhoneId: "SELECT MAX(id) FROM contact_phone WHERE contact_id = $1 AND user_id = $2",
		getContactEmail: "SELECT id, email_type, email_direction FROM contact_email WHERE contact_id = $1 AND user_id = $2",
		getMaxContactEmailId: "SELECT MAX(id) FROM contact_email WHERE contact_id = $1 AND user_id = $2",
		getContactURL: "SELECT id, url FROM contact_url WHERE contact_id = $1 AND user_id = $2",
		getMaxContactURLId: "SELECT MAX(id) FROM contact_url WHERE contact_id = $1 AND user_id = $2",
		getContactDate: "SELECT id, date_type, contact_date FROM contact_date WHERE contact_id = $1 AND user_id = $2",
		getMaxContactDateId: "SELECT MAX(id) FROM contact_date WHERE contact_id = $1 AND user_id = $2",
		getGroups: "SELECT id, group_name, group_description, color FROM group_data WHERE user_id = $1",
		getMaxGroupId: "SELECT MAX(id) FROM group_data WHERE user_id = $1",
		getGroupById: "SELECT * FROM group_data WHERE id = $1 AND user_id = $2",
		getContactGroups: "SELECT group_id, contact_id FROM contact_group WHERE user_id = $1",
		getContactGroup: "SELECT group_id, contact_id FROM contact_group WHERE user_id = $1 AND contact_id = $2 AND group_id = $3",
		getContactsByGroup:
			"SELECT c.id, c.first_name, c.last_name, c.contact_alias, c.color, cp.phone_code, cp.phone_number FROM contact c LEFT JOIN contact_phone cp ON c.id = cp.contact_id AND cp.id = 1 WHERE c.user_id = $1 AND c.id IN (SELECT contact_id FROM contact_group WHERE user_id = $1 AND group_id = $2)",
	},
	insert: {
		insertUser: "INSERT INTO users (id, email, user_password) VALUES ($1, $2, $3)",
		insertContact:
			"INSERT INTO contact (id, user_id, first_name, last_name, contact_alias, company, address, color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
		insertGroup: "INSERT INTO group_data (id, user_id, group_name, group_description, color) VALUES ($1, $2, $3, $4, $5)",
		insertContactGroup: "INSERT INTO contact_group (user_id, contact_id, group_id) VALUES ($1, $2, $3)",
		insertContactPhone:
			"INSERT INTO contact_phone (id, user_id, contact_id, phone_type, phone_code, phone_number) VALUES ($1, $2, $3, $4, $5 , $6)",
		insertContactEmail: "INSERT INTO contact_email (id, user_id, contact_id, email_type, email_direction) VALUES ($1, $2, $3, $4, $5)",
		insertContactURL: "INSERT INTO contact_url (id, user_id, contact_id, url) VALUES ($1, $2, $3, $4)",
		insertContactDate: "INSERT INTO contact_date (id, user_id, contact_id, date_type, contact_date) VALUES ($1, $2, $3, $4, $5)",
	},
	update: {
		updateUserEmail: "UPDATE users SET email = $1 WHERE id = $2",
		updateUserPassword: "UPDATE users SET user_password = $1 WHERE id = $2",
		updateContact:
			"UPDATE contact SET first_name = $1, last_name = $2, contact_alias = $3, company = $4, address = $5, color = $6 WHERE id = $7 AND user_id = $8",
		updateContactPhone:
			"UPDATE contact_phone SET phone_type = $1, phone_code = $2, phone_number = $3 WHERE contact_id = $4 AND user_id = $5 AND id = $6",
		updateContactEmail: "UPDATE contact_email SET email_type = $1, email_direction = $2 WHERE contact_id = $3 AND user_id = $4 AND id = $5",
		updateContactURL: "UPDATE contact_url SET url = $1 WHERE contact_id = $2 AND user_id = $3 AND id = $4",
		updateContactDate: "UPDATE contact_date SET date_type = $1, contact_date = $2 WHERE contact_id = $3 AND user_id = $4 AND id = $5",
		updateGroup: "UPDATE group_data SET group_name = $1, group_description = $2, color = $3 WHERE user_id = $4 AND id = $5",
	},
	delete: {
		deleteUser: "DELETE FROM users WHERE id = $1",
		deleteUserFromContactDate: "DELETE FROM contact_date WHERE user_id = $1",
		deleteUserFromContactEmail: "DELETE FROM contact_email WHERE user_id = $1",
		deleteUserFromContactPhone: "DELETE FROM contact_phone WHERE user_id = $1",
		deleteUserFromContactURL: "DELETE FROM contact_url WHERE user_id = $1",
		deleteUserFromContacts: "DELETE FROM contact WHERE user_id = $1",
		deleteUserFromContactGroup: "DELETE FROM contact_group WHERE user_id = $1",
		deleteUserFromGroups: "DELETE FROM group_data WHERE user_id = $1",
		deleteContact: "DELETE FROM contact WHERE id = $1 AND user_id = $2",
		deleteContactPhone: "DELETE FROM contact_phone WHERE contact_id = $1 AND user_id = $2 AND id = $3",
		deleteContactPhones: "DELETE FROM contact_phone WHERE contact_id = $1 AND user_id = $2",
		deleteContactEmail: "DELETE FROM contact_email WHERE contact_id = $1 AND user_id = $2 AND id = $3",
		deleteContactEmails: "DELETE FROM contact_email WHERE contact_id = $1 AND user_id = $2",
		deleteContactURL: "DELETE FROM contact_url WHERE contact_id = $1 AND user_id = $2 AND id = $3",
		deleteContactURLs: "DELETE FROM contact_url WHERE contact_id = $1 AND user_id = $2",
		deleteContactDate: "DELETE FROM contact_date WHERE contact_id = $1 AND user_id = $2 AND id = $3",
		deleteContactDates: "DELETE FROM contact_date WHERE contact_id = $1 AND user_id = $2",
		deleteGroup: "DELETE FROM group_data WHERE id = $1 AND user_id = $2",
		/* deleteContactGroup: "DELETE FROM contact_group WHERE contact_id = $1 AND user_id = $2", */
		deleteAllContactsFromGroup: "DELETE FROM contact_group WHERE group_id = $1 AND user_id = $2",
		deleteContactFromAllGroups: "DELETE FROM contact_group WHERE contact_id = $1 AND user_id = $2",
		deleteContactFromGroup: "DELETE FROM contact_group WHERE contact_id = $1 AND group_id = $2 AND user_id = $3",
	},
};

export { queries };
