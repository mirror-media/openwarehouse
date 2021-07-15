# openwarehouse

A content management system base on the Keystone.js 5

## Database Migration

If any of the `lists` changes, the database schema must be changed accordingly.

When it happens, developers are responsible for following things:

1. When `lists` have change, the same commit or PR should contain a migration sql script in the `lists/{project}/pq/migrations/`.
2. The file must have a **prefix number** to it's filename to show the patch order.
3. This file should be applied to the database from the last migration and the result must match the `lists`.

To help you generate the migration script, you may use `keystone upgrade-relationships` and `keystone upgrade-relationships --migration` as a starting point. [Document for them](https://v5.keystonejs.com/guides/relationship-migration#postgresql)

## How CI/CD works?
We use [Google Cloud Build](https://cloud.google.com/build/docs/how-to) to do CI/CD.
And we already have a build trigger ([openwarehouse-build-and-deploy](https://console.cloud.google.com/cloud-build/triggers/edit/7e66e087-131f-4af8-bc88-cef88e3f56a6?project=mirror-tv-275709)) connected to this repo.

For quick understanding how the CI/CD works, please see the following diagram.

<img src="https://github.com/nickhsine/openwarehouse/blob/docs-for-cicd/docs/images/cicd-diagram.jpg" >

### Three Branches to Control CI/CD
Three branches are `dev`, `staging` and `prod` respectively.

When new codes are merged into these three branches, they are also built and deployed to three environemts.

If we want to deploy new commits to `dev` environemt, we do
1. create a PR: `base` is `dev` branch, and `compare` is the branch containing new commits
2. ask code reviews
3. merge the PR

After the PR merged, our cloud build trigger ([openwarehouse-build-and-deploy](https://console.cloud.google.com/cloud-build/triggers/edit/7e66e087-131f-4af8-bc88-cef88e3f56a6?project=mirror-tv-275709)) will start to run.

### What Cloud Build Does?
The cloud build will
1. clone openwarehouse 
2. checkout `dev` branch
3. install app's depencies (`yarn install`) and create app's the bundles (`yarn build`) 
4. build docker image: image name will be `gcr.io/mirror-tv-275709/openwarehouse`, and tag will be `dev_fd120b5` (see Note 1) for example.
5. push docker image to Google Container Registry (see Note 2)
6. clone [mirror-media/kubernetes-configs](https://github.com/mirror-media/kubernetes-configs)
7. generate kubernetes configs with `namespace: dev` 
8. apply generated kubernetes configs to `tv-cluster`

Note:
1. Branch name, for example `dev`, will be part of tag name. `fd120b5` is the first seven characters of the commit ID associated with your build.
2. You can list image tags in the [Google Container Registry](https://console.cloud.google.com/gcr/images/mirror-tv-275709/GLOBAL/openwarehouse?project=mirror-tv-275709&gcrImageListsize=30).

### How to Deploy to Staging?
If `dev` environment is deployed and tested, we could move on to deploy `staging` environment.
For deploying `staging` environment, we do 
1. create a PR: `base` is `staging` branch, and `compare` is `dev` branch
2. ask PM if we could deploy or not
3. if we could deploy, then merge the PR

After merging that PR, the cloud build will follow the above steps to build a new image tag, `staging_39639fe` for example, and deploy it to `staging` environment.

### How to Deploy to Production?
For deploying to `prod` environment, we do almost the same thing as deploying to `staging`.
Just create a new PR. `base` is `prod` branch and `compare` is `staging` branch instead.
However, there is one thing to mention, **we must confirm with PM before merging this PR**.
