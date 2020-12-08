/** @format */

const execa = require("execa");

async function initUser(store) {
  const confList = (await execa.command("git config --list")).stdout.match(
    /(?:(user.(name|email)))(.+)/g
  );
  const users = [];
  // Count name,email,signKey to match multi user
  let [nameC, emailC, signKeyC] = [0, 0, 0];
  confList.forEach((e) => {
    users[Math.max(nameC, emailC, signKeyC)] = {};
    switch (e) {
      case e.includes("name") ? e : null:
        users[nameC++].name = e.slice(e.indexOf("=") + 1);
        break;

      case e.includes("email") ? e : null:
        users[emailC++].email = e.slice(e.indexOf("=") + 1);
        break;

      case e.includes("signingKey") ? e : null:
        users[signKeyC++].signingKey = e.slice(e.indexOf("=") + 1);
        break;
    }
  });

  users.pop();
  store.set("users", users);
}

module.exports = initUser;
