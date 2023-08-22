const {v4} = require('uuid');
const AWS = require('aws-sdk');
const middy = require('@middy/core');
const jsonBodyParser = require('@middy/http-json-body-parser');

const addUser = async(event) => {
  try {
    const dynamoDB = new AWS.DynamoDB.DocumentClient();
    const ssm = new AWS.SSM();
    const parameterName = '/mi-aplicacion/dataUser';
    const response = await ssm.getParameter({ Name: parameterName }).promise();
    const variableValue = response.Parameter.Value;

    const id = v4();
    const createdAt = new Date();
    const { nameUser, documentUser } = event.body;

    const newUser = {
      id,
      createdAt,
      nameUser,
      documentUser
    };
    
    await dynamoDB.put({
      TableName: variableValue,
      Item: newUser
    }).promise();
 
    return{
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        message: 'Register success', 
        newUser 
      })
    };
    
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addUser: middy(addUser).use(jsonBodyParser()),
}