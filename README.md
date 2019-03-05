# Bitbucket Chat Serverless

You need to install the serverless framework to deploy this project:

```
npm install -g serverless
```

## Tests

### Unit tests

The unit tests are not using networking at all.

```
npm test
```
### Testing the chatbot on lambda deployment

This step require to deploy the tool on Lambda and interact with it via Hangout Chat.

- Deploy on lambda via serverless framework

You need to have proper ``.aws/credentials`` file that allow you to interact with AWS Lambda.

```
sls deploy
```

This command deploy all the package. After that you can push only one function to Lambda it is really faster if you work with a specific function :

```
sls deploy function -f hangout_receive
```

- Get logs of the lambda platform

```
sls logs -f hangout_receive
```

It work for a specific functon only.

- Invoke a function locally

```
sls invoke local -f hangout_receive
```
