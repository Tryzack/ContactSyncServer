export function logout(req, res) {
	if (req.session.userId) {
		req.session.destroy();
		res.send({ message: "Logged out" });
	} else {
		res.status(401).send({ message: "Unauthorized" });
	}
}
