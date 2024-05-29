export async function checkSession(req, res) {
	if (!req.session.userId) {
		res.status(401).send({ message: "Unauthorized" });
		return;
	}
	res.send({ message: "Session is active" });
}
