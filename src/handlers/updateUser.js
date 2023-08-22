const AWS = require('aws-sdk');
const middy = require('@middy/core');
const jsonBodyParser = require('@middy/http-json-body-parser');

const updateUser = async(event) => {
    try {
        const dynamoDB = new AWS.DynamoDB.DocumentClient();
        const ssm = new AWS.SSM();
        const parameterName = '/mi-aplicacion/dataUser';
        const response = await ssm.getParameter({ Name: parameterName }).promise();
        const variableValue = response.Parameter.Value;
        const { id } = event.pathParameters;

        const { nameUser, documentUser } = event.body;

        await dynamoDB.update({
            TableName: variableValue,
            Key: { id },
            UpdateExpression: 'set nameUser = :nameUser, documentUser = :documentUser',
            ExpressionAttributeValues: {
                ':nameUser': nameUser,
                ':documentUser': documentUser,
            },
            ReturnValues: 'ALL_NEW'
        }).promise();

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                message: 'Modification success'
            })
        }
        
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
  updateUser: middy(updateUser).use(jsonBodyParser()),
}