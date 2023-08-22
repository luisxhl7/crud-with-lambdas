const AWS = require('aws-sdk');

const deleteUser = async(event) => {
    try {
        const dynamoDB = new AWS.DynamoDB.DocumentClient();
        const ssm = new AWS.SSM();
        const parameterName = '/mi-aplicacion/dataUser';
        const response = await ssm.getParameter({ Name: parameterName }).promise();
        const variableValue = response.Parameter.Value;
        const { id } = event.pathParameters;
    
        await dynamoDB.delete({
            TableName: variableValue,
            Key: {
                id
            }
        }).promise();
    
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                message: 'Delete success'
            })
        }
        
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    deleteUser,
}