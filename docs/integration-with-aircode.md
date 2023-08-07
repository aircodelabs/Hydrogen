# Integrate Hydrogen with AirCode online

Hydrogen and AirCode are highly compatible, making it easy to run the AirCode project locally using Hydrogen, and vice versa.

## Run AirCode Project with Hydrogen

1. Login to [AirCode dashboard](https://aircode.io/dashboard). Select your project or create a new one.

<img src="https://aircode-yvo.b-cdn.net/resource/1691136624761-xmqrw16ncb.jpg" width="350">

2. Deploy your project.

<img src="https://aircode-yvo.b-cdn.net/resource/1691137862770-51tv439664b.jpg" width="350">

3. Click `Publish to GitHub`

<img src="https://aircode-yvo.b-cdn.net/resource/1691136880551-1kt05tpwz5z.jpg" width="350">

<img src="https://aircode-yvo.b-cdn.net/resource/1691137052162-gtvbqe0z1or.jpg" width="350">

3. Clone the GitHub repository code to your local machine.

4. Navigate to the local project directory.

```bash
cd my-repo-dir/examples/test-project
```

5. Run `npx create-aircode-app`

```bash
npx create-aircode-app@latest
```

```bash
Updated aircode app in current directory.
To get started, run the following commands:
  npm install
  npm start
```

6. Install dependencies

```bash
npm install
```

7. Start the Hydrogen Server

```bash
npm start
```

## Deploy Hydrogen Project to AirCode

If your project is created by `npx create-aircode-app@latest`, you can easily deploy your project to AirCode by the following steps:

1. Create a github repo, and set it into your `package.json` file, for example:

```json
  "repository": {
    "type": "git",
    "url": "git+https://github.com/akira-cn/aircode-app-example.git"
  },
```

2. Run `npm run deploy` to prepare the deploy info for AirCode.

3. Push your code to Github.

4. Visit your `functions/README.md`, Click the `Deploy` button to deploy your project to AirCode.

<img src="https://aircode-yvo.b-cdn.net/resource/1691151473285-7u45bcpu3qe.jpg" width="350">
