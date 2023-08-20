import { getSession } from "next-auth/react";

const authMiddleware = handler => async (req, res) => {
  const session = await getSession({ req });
  console.log("----sesssion", session);

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  return handler(req, res);
};

export default authMiddleware;
