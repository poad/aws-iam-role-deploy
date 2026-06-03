# aws-iam-role-deploy

GitHub Actions の OIDC 連携用 IAM ロールを AWS CDK でデプロイします。

## スタック構成

- **IAM Role** (`iam-role-deploy-role`) — GitHub Actions OIDC プロバイダ (`token.actions.githubusercontent.com`) を信頼

## Useful commands

- `pnpm build` — TypeScript をコンパイル
- `pnpm test` — vitest によるユニットテスト
- `pnpm lint` — ESLint によるリント
- `pnx cdk deploy` — スタックをデプロイ
- `pnx cdk diff` — デプロイ済みスタックとの差分表示
- `pnx cdk synth` — CloudFormation テンプレートを生成
