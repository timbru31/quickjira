workflow "Security" {
  on = "push"
  resolves = ["Run a security audit"]
}

action "Run a security audit" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  runs = "npm audit"
}
