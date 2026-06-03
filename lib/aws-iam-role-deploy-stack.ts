import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';

export class AwsIamRoleDeployStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const account = cdk.Aws.ACCOUNT_ID;
    const region = cdk.Aws.REGION;

    // CI/CD や開発者に付与するデプロイ実行ポリシー（Bootstrap ロールを前提）
    const cdkDeployPolicy = new iam.ManagedPolicy(this, 'CdkDeployPolicy', {
      managedPolicyName: 'CdkDeployMinimalPolicy',
      description: 'Minimal policy to run cdk deploy using bootstrapped roles',
      statements: [
        // 1. Bootstrap ロールへの AssumeRole
        new iam.PolicyStatement({
          sid: 'AssumeBootstrapRoles',
          effect: iam.Effect.ALLOW,
          actions: ['sts:AssumeRole'],
          resources: [
            `arn:aws:iam::${account}:role/cdk-*`,
          ],
        }),

        // 2. CloudFormation スタックの読み取り（差分確認・状態確認）
        new iam.PolicyStatement({
          sid: 'CloudFormationRead',
          effect: iam.Effect.ALLOW,
          actions: [
            'cloudformation:DescribeStacks',
            'cloudformation:DescribeStackEvents',
            'cloudformation:GetTemplate',
            'cloudformation:ListStacks',
          ],
          resources: ['*'],
        }),

        // 3. SSM Parameter Store からのコンテキスト値取得（cdk context lookup）
        new iam.PolicyStatement({
          sid: 'SsmContextLookup',
          effect: iam.Effect.ALLOW,
          actions: ['ssm:GetParameter'],
          resources: [
            `arn:aws:ssm:${region}:${account}:parameter/cdk-bootstrap/*`,
          ],
        }),

        // 4. ECR 認証トークン取得（Docker アセットがある場合）
        new iam.PolicyStatement({
          sid: 'EcrAuthToken',
          effect: iam.Effect.ALLOW,
          actions: ['ecr:GetAuthorizationToken'],
          resources: ['*'],
        }),
      ],
    });

    new iam.Role(this, 'Role', {
      roleName: 'iam-role-deploy-role',
      assumedBy: new iam.FederatedPrincipal(
        `arn:aws:iam::${this.account}:oidc-provider/token.actions.githubusercontent.com`, {
          StringLike: {
            'token.actions.githubusercontent.com:sub': 'repo:poad/*:*',
          },
        },
        'sts:AssumeRoleWithWebIdentity',
      ).withSessionTags(),
      managedPolicies: [
        cdkDeployPolicy,
      ],
      inlinePolicies: {
        'iam-policy': new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: [
                'AttachRolePolicy',
                'CreateRole',
                'CreatePolicy',
                'CreatePolicyVersion',
                'CreateServiceLinkedRole',
                'DeletePolicy',
                'DeletePolicyVersion',
                'DeleteRole',
                'DeleteRolePermissionsBoundary',
                'DeleteRolePolicy',
                'GetPolicy',
                'GetPolicyVersion',
                'GetRole',
                'GetRolePolicy',
                'ListAttachedRolePolicies',
                'ListPolicies',
                'ListPoliciesGrantingServiceAccess',
                'ListPolicyTags',
                'ListPolicyVersions',
                'ListRolePolicies',
                'ListRoleTags',
                'ListRoles',
                'PutRolePermissionsBoundary',
                'PutRolePolicy',
                'TagPolicy',
                'TagRole',
                'UntagPolicy',
                'UntagRole',
                'UpdateRole',
                'UpdateRoleDescription',
              ].map((action) => `iam:${action}`),
              resources: ['*'],
            }),
          ],
        }),
      },

    });
  }
}
