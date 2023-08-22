const AWS = require('aws-sdk');

const getUser = async (event) => {
  try {
    
    const dynamoDB = new AWS.DynamoDB.DocumentClient();
    const ssm = new AWS.SSM();
    const parameterName = '/mi-aplicacion/dataUser';
    const response = await ssm.getParameter({ Name: parameterName }).promise();
    const variableValue = response.Parameter.Value;
    const {id} = event.pathParameters

    const result = await dynamoDB.get({
      TableName: variableValue,
      Key: {
        id: id
      }
    }).promise();

    const user = result.Item;
    
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Headers" : "*",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*"
      },
      body: JSON.stringify({
        message: 'Search success', 
        user 
      })
    }

  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getUser,
}