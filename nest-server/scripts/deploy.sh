set -e
set -o pipefail

npm run build

# scp -r \
rsync -SavLP \
  package.json \
	public \
	dist \
	tecky1:~/final-project/

ssh tecky1 "
source ~/.nvm/nvm.sh && \
cd ~/final-project && \
pnpm i --prod && \
cp .env dist/ && \
npx knex migrate:latest --knexfile dist/knexfile.js --env production && \
pm2 reload final-project && \
pm2 list && \
pm2 log final-project
"
