set -e

npm run build

cd dist

git add -A
git commit -m 'Alpha deploy'

git push -f git@github.com:MiyoKind/vue-crypto-tracker-app.git master:gh-pages

cd -

