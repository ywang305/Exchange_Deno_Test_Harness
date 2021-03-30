# Exchange_Deno_Bot

## Install Deno

```bash
# (Linux/Mac)
curl -fsSL https://deno.land/x/install/install.sh | sh
# or (Mac)
brew install deno
```

## Run

deno run ...

## With VS Code

The simplest way to use this plugin is to install the [TypeScript Deno Plugin VS Code extension](https://marketplace.visualstudio.com/items?itemName=justjavac.vscode-deno). This extension enables the plugin when using VS Code's version of TypeScript.

- config : cmd+ctl+p : deno: initializing
  for workspace enable features like: syntax, lint...
- debug : launch.json

## notes

- [All the functionality that is not covered by a Web API lives under the Deno namespace. This is functionality that is exclusive to Deno and that can't, for instance, be bundled to run in Node or the browser.](https://doc.deno.land/builtin/stable)
- [chap3 The Runtime and Standard Library](https://github.com/PacktPublishing/Deno-Web-Development/tree/master/Chapter03)
- [chap4 Web App](https://github.com/PacktPublishing/Deno-Web-Development/tree/master/Chapter04/museums-api)
  - This is very different compared to an opinionated web framework, such as PHP Symfony, Java SpringBoot, or Ruby on Rails, where many of these decisions are made for us. The aforementioned frameworks can't be directly compared with Deno since they are frameworks built on top of languages, such as PHP, Java, and Ruby. But when we look at the JS world, namely at Node.js we can observe that the most popular tools used to create HTTP servers are Express.js and Kao. These tend to be much lighter than the aforementioned frameworks, and even though there are also some solid complete alternatives such as Nest.js or hapi.js, the Node.js community tends to prefer a library approach more than a framework one. Even though these very popular libraries provide a good amount of functionality, many decisions are still delegated to developers. This isn't the libraries' fault, but more a community preference.
