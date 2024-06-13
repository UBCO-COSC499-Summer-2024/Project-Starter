// simple node web server that displays hello world
// optimized for Docker image
const { authUser } = require('./authenticate');

const express = require("express");
// this example uses express web framework so we know what longer build times
// do and how Dockerfile layer ordering matters. If you mess up Dockerfile ordering
// you'll see long build times on every code change + build. If done correctly,
// code changes should be only a few seconds to build locally due to build cache.

const morgan = require("morgan");
// morgan provides easy logging for express, and by default it logs to stdout
// which is a best practice in Docker. Friends don't let friends code their apps to
// do app logging to files in containers.

// Appi
const app = express();

app.use(morgan("common"));

app.use(express.json());
app.use(express.urlencoded());

app.get("/", function(req, res, next) {
  res.json({ message: `GradeIT OMR Technologies` })
}
    );

app.get("/healthz", function(req, res) {
  // do app logic here to determine if app is truly healthy
  // you should return 200 if healthy, and anything else will fail
  // if you want, you should be able to restrict this to localhost (include ipv4 and ipv6)
  res.send("I am happy and healthy\n");
});

app.post("/api/auth/login", async (req,res) => {
  const auth = await authUser(req.body.email, req.body.password);
  console.log(auth);
})

module.exports = app;
