import * as AwsIamRoleDeploy from '../lib/aws-iam-role-deploy-stack.js';
import * as cdk from 'aws-cdk-lib/core';
import { Template } from 'aws-cdk-lib/assertions';
import { test, expect } from 'vitest';

// example test. To run these tests, uncomment this file along with the
// example resource in lib/aws-iam-role-deploy-stack.ts
test('IAM Role Created', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new AwsIamRoleDeploy.AwsIamRoleDeployStack(app, 'MyTest');
  // THEN
  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::IAM::Role', {
  });

  expect(template.findResources('AWS::IAM::Role')).not.toBeUndefined();
});
