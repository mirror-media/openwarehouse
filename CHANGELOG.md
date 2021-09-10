# Openwarehouse Changelog

## 2021-09-07, Version 1.1.8 @liyibass

### Notable Changes

-   feat: add new list: Sponsor
-   feat: add new field in Show
-   feat: add new field in Contact

### commits

-   [[`648e434c4f`](https://github.com/mirror-media/openwarehouse/commit/648e434c4f)] - **chore**: bump version to v1.1.8 (LIYI)
-   [[`0e4c059c6f`](https://github.com/mirror-media/openwarehouse/commit/0e4c059c6f)] - Merge pull request #72 from mirror-media/updateFields (LIYI)
-   [[`90e4978050`](https://github.com/mirror-media/openwarehouse/commit/90e4978050)] - feat(migration): add migration script (bcgodev)
-   [[`4bf5819e1b`](https://github.com/mirror-media/openwarehouse/commit/4bf5819e1b)] - **feat**: add new field:trailerPlaylist in Show (LIYI)
-   [[`c066eb60f3`](https://github.com/mirror-media/openwarehouse/commit/c066eb60f3)] - **feat**: update Contact image fields (LIYI)
-   [[`e3430de555`](https://github.com/mirror-media/openwarehouse/commit/e3430de555)] - **feat**: add Sponsor table (LIYI)
-   [[`eb5ec2ad55`](https://github.com/mirror-media/openwarehouse/commit/eb5ec2ad55)] - **chore**: update CHANGELOG.md (LIYI)

# 2021-08-31, Version 1.1.7 @liyibass

### Notable Changes

-   fix: fix Contact instagram typo
-   feat: update ArtShow_author_many part

### commits

-   [[`95a128f6ea`](https://github.com/mirror-media/openwarehouse/commit/95a128f6ea)] - **chore**: bump version to v1.1.7 (LIYI)
-   [[`369a33f8f9`](https://github.com/mirror-media/openwarehouse/commit/369a33f8f9)] - **fix**: fix Contact label typo (LIYI)
-   [[`ad45660644`](https://github.com/mirror-media/openwarehouse/commit/ad45660644)] - **fix**: fix typo (LIYI)
-   [[`e034bbb1a7`](https://github.com/mirror-media/openwarehouse/commit/e034bbb1a7)] - miss the ArtShow_author_many part (Hsin-chan Chien)
-   [[`7abea3d558`](https://github.com/mirror-media/openwarehouse/commit/7abea3d558)] - **chore**: update CHANGELOG (LIYI)
-   [[`2bee53394d`](https://github.com/mirror-media/openwarehouse/commit/2bee53394d)] - **chore**: bump version to v1.1.6, update package.json and CHANGELOG (LIYI)

## 2021-08-25, Version 1.1.6 @liyibass

### Notable Changes

-   feat: add new fields:

#### Post

-   isAdult: boolean

#### Serie

-   introductionApiData: string
-   introductionHtml:string

#### Contact

-   bioApiData: string
-   bioHtml: string

#### ArtShow

-   state: type: Select
-   publishTime: type: DateTime
-   show: Type: Relationship to Show （ArtShow to Show 單方向 一對一）
-   contentApiData:string
-   contentHtml: string
-   author(修改)：relationship 改成一對多

#### Topic

-   post: relationship 單方向一對多

#### 移除 list

-   mmPost
-   Schedule

### commits

-   [[`2bee53394d`](https://github.com/mirror-media/openwarehouse/commit/2bee53394d)] - **chore**: bump version to v1.1.6, update package.json and CHANGELOG (LIYI)
-   [[`b0b0a5956c`](https://github.com/mirror-media/openwarehouse/commit/b0b0a5956c)] - Alter table ArtShow to add publishTime related columns (Hsin-chan Chien)
-   [[`62bdd66fb8`](https://github.com/mirror-media/openwarehouse/commit/62bdd66fb8)] - add a new migration about post/authors and topic/posts relationship (Hsin-chan Chien)
-   [[`1aae6847ef`](https://github.com/mirror-media/openwarehouse/commit/1aae6847ef)] - **feat**: add Topic.post reference(one to many) (LIYI)
-   [[`47cbcc2180`](https://github.com/mirror-media/openwarehouse/commit/47cbcc2180)] - Merge pull request #65 from mirror-media/fieldModify (LIYI)
-   [[`145854f2d7`](https://github.com/mirror-media/openwarehouse/commit/145854f2d7)] - Merge branch 'dev' into fieldModify (LIYI)
-   [[`d129823dc2`](https://github.com/mirror-media/openwarehouse/commit/d129823dc2)] - **chore**: bump version to v1.1.5 (LIYI)

## 2021-08-23, Version 1.1.5 @liyibass

### Notable Changes

-   feat: change Post slug to Text field(to prevent auto-overwrite existing slug)
-   fix: fix emitEditLog while creating Post
-   feat: add new post sourceHandler, generate source depend on post's style

### commits

-   [[`0c1db6d1ea`](https://github.com/mirror-media/openwarehouse/commit/0c1db6d1ea)] - **feat**: change Post slug from Slug to Text field (LIYI)
-   [[`f7d1ac87bb`](https://github.com/mirror-media/openwarehouse/commit/f7d1ac87bb)] - **fix**: fix emitEditLog issue in create mode (LIYI)
-   [[`20d3f1e823`](https://github.com/mirror-media/openwarehouse/commit/20d3f1e823)] - **feat**: add postSourceHandler (LIYI)
-   [[`e314b9968f`](https://github.com/mirror-media/openwarehouse/commit/e314b9968f)] - **chore**: update package.json and CHANGLOG.md (LIYI)

## 2021-08-16, Version 1.1.4 @liyibass

### Notable Changes

-   fix: EditLog error fixed
-   feat: update all list's access control
-   feat:relationship with Post can browse/search with slug & name

### commits

-   [[`84c569da11`](https://github.com/mirror-media/openwarehouse/commit/84c569da11)] - **feat**: emitEditLog with headers (LIYI)
-   [[`5649ebb982`](https://github.com/mirror-media/openwarehouse/commit/5649ebb982)] - **refactor**: re-constructor emitEditLog (LIYI)
-   [[`0bb2557f39`](https://github.com/mirror-media/openwarehouse/commit/0bb2557f39)] - **feat**: update bot access control (LIYI)
-   [[`4725778b54`](https://github.com/mirror-media/openwarehouse/commit/4725778b54)] - **feat**: update bot create/update edit control (LIYI)
-   [[`c56ed242df`](https://github.com/mirror-media/openwarehouse/commit/c56ed242df)] - **feat**: update contributor acccess control in EditorChoice, Post and VideoEditorChoice (LIYI)
-   [[`d5e0d5197e`](https://github.com/mirror-media/openwarehouse/commit/d5e0d5197e)] - **refactor**: remove unuse imported package (LIYI)
-   [[`a053593448`](https://github.com/mirror-media/openwarehouse/commit/a053593448)] - **feat**: update all list's access control (LIYI)
-   [[`23612fc7e3`](https://github.com/mirror-media/openwarehouse/commit/23612fc7e3)] - **feat**: update media list access control (LIYI)
-   [[`44118194af`](https://github.com/mirror-media/openwarehouse/commit/44118194af)] - **feat**: update User/Post access control (LIYI)
-   [[`ece72bc0de`](https://github.com/mirror-media/openwarehouse/commit/ece72bc0de)] - feat(mirror-tv/list): remove unwanted defaultValue of fields in Post.js (#62) (Baron Chiu)
-   [[`0d8579c655`](https://github.com/mirror-media/openwarehouse/commit/0d8579c655)] - **feat**: update field naming (LIYI)
-   [[`7533faa3a9`](https://github.com/mirror-media/openwarehouse/commit/7533faa3a9)] - **feat**: update CustomRelationship slug/name layout (LIYI)
-   [[`41a6119038`](https://github.com/mirror-media/openwarehouse/commit/41a6119038)] - **feat**: CustomRelationship can search within name and slug (LIYI)
-   [[`c729c9529c`](https://github.com/mirror-media/openwarehouse/commit/c729c9529c)] - **rafactor**: update CustomRelationship naming (LIYI)
-   [[`4241817df8`](https://github.com/mirror-media/openwarehouse/commit/4241817df8)] - **feat**: set all Relationship (ref to Post) to CustomRelationship (LIYI)
-   [[`95905f6e8c`](https://github.com/mirror-media/openwarehouse/commit/95905f6e8c)] - **feat**: add customRelationship to see slug (LIYI)
-   [[`c0006f1e38`](https://github.com/mirror-media/openwarehouse/commit/c0006f1e38)] - **chore**: update CHANGELOG.md: add detail change log (LIYI)

## 2021-07-29, Version 1.1.3 @liyibass

### Notable Changes

-   feat: add all list's delete access control to moderator
-   remove defaultValue of heroCaption in Post.js

### Commits

-   [[`f625b34592`](https://github.com/mirror-media/openwarehouse/commit/f625b34592)] - **chore**: update CHANGELOG.md (LIYI)
-   [[`324fb5ec97`](https://github.com/mirror-media/openwarehouse/commit/324fb5ec97)] - **chore**: bum version to v1.1.3 (LIYI)
-   [[`b1ac24c9d6`](https://github.com/mirror-media/openwarehouse/commit/b1ac24c9d6)] - **feat**: add all list's delete access control to moderator (LIYI)
-   [[`57c3563a78`](https://github.com/mirror-media/openwarehouse/commit/57c3563a78)] - feat(mirror-tv): remove defaultValue of heroCaption in Post.js (#60) (Baron Chiu)
-   [[`2e9ee1840d`](https://github.com/mirror-media/openwarehouse/commit/2e9ee1840d)] - finished the test (Hsin-chan Chien)
-   [[`ec0ab74068`](https://github.com/mirror-media/openwarehouse/commit/ec0ab74068)] - test for just doing resize once (Hsin-chan Chien)
-   [[`64d8c0c111`](https://github.com/mirror-media/openwarehouse/commit/64d8c0c111)] - test the cloud build (Hsin-chan Chien)

## 2021-07-27, Version 1.1.2 @liyibass

### Notable Changes

-   feat: optimize image compress/resize method
-   feat:update draft: fix infobox/annotation paste bug

### Commits

-   [[`d2d4bf32b8`](https://github.com/mirror-media/openwarehouse/commit/d2d4bf32b8)] - **chore**: bump version to 1.1.2, update CHANGELOG.md (LIYI)
-   [[`d875c2549f`](https://github.com/mirror-media/openwarehouse/commit/d875c2549f)] - **refactor**: remove unuse console.log (LIYI)
-   [[`3da6db6a48`](https://github.com/mirror-media/openwarehouse/commit/3da6db6a48)] - **refactor**: optimize image processing workflow (#53) (Baron Chiu)
-   [[`9b5625254b`](https://github.com/mirror-media/openwarehouse/commit/9b5625254b)] - **feat**: update draft to fix paste error in infobox/annotation (liyibass)
-   [[`15f4a18401`](https://github.com/mirror-media/openwarehouse/commit/15f4a18401)] - **chore**: add compress time tracker (liyibass)
-   [[`20d30c7f49`](https://github.com/mirror-media/openwarehouse/commit/20d30c7f49)] - **refactor**: change image compress package to imagickal (liyibass)
-   [[`b474c98f1a`](https://github.com/mirror-media/openwarehouse/commit/b474c98f1a)] - try to install imageMagick for image processing (Hsin-chan Chien)
-   [[`35117a94eb`](https://github.com/mirror-media/openwarehouse/commit/35117a94eb)] - add upload Image log to trace the performance issues (Hsin-chan Chien)
-   [[`4a0690e0ff`](https://github.com/mirror-media/openwarehouse/commit/4a0690e0ff)] - add upload Image log to trace the performance issues (Hsin-chan Chien)
-   [[`4957259b0b`](https://github.com/mirror-media/openwarehouse/commit/4957259b0b)] - add upload Image log to trace the performance issues (Hsin-chan Chien)
-   [[`5f649a30df`](https://github.com/mirror-media/openwarehouse/commit/5f649a30df)] - add upload Image log to trace the performance issues (Hsin-chan Chien)
-   [[`99e6484b82`](https://github.com/mirror-media/openwarehouse/commit/99e6484b82)] - add upload Image log to trace the performance issues (Hsin-chan Chien)
-   [[`40626845f3`](https://github.com/mirror-media/openwarehouse/commit/40626845f3)] - **chore**: update changelog.md (liyibass)

## 2021-07-16, Version 1.1.1 @liyibass

### Notable Changes

-   feat: add config in createPreviewServerProxy(to add custom header in proxy)
-   feat: set proxy page Cache-Control to no-store

### Commits

-   [[`ef179e831a`](https://github.com/mirror-media/openwarehouse/commit/ef179e831a)] - Merge pull request #50 from liyibass/dev (LIYI)
-   [[`7b7badb0b1`](https://github.com/mirror-media/openwarehouse/commit/7b7badb0b1)] - **feat**: add config in createPreviewServerProxy for setting custom proxy headers (liyibass)
-   [[`fc58bd286f`](https://github.com/mirror-media/openwarehouse/commit/fc58bd286f)] - **chore**: update package.json#version to 1.1.1 (liyibass)
-   [[`2e8b41ad1b`](https://github.com/mirror-media/openwarehouse/commit/2e8b41ad1b)] - Merge pull request #49 from liyibass/dev (LIYI)
-   [[`cb72bf479b`](https://github.com/mirror-media/openwarehouse/commit/cb72bf479b)] - **feat**: set cache control to no-store (liyibass)
-   [[`6cfeeb330d`](https://github.com/mirror-media/openwarehouse/commit/6cfeeb330d)] - **feat**: update adding Cashe-Control in preview page (liyibass)
-   [[`7ff9cfdde3`](https://github.com/mirror-media/openwarehouse/commit/7ff9cfdde3)] - **feat**: add Cashe-Control in preview page (liyibass)
-   [[`e29d7d8217`](https://github.com/mirror-media/openwarehouse/commit/e29d7d8217)] - Merge pull request #46 from liyibass/dev (LIYI)

## 2021-07-16, Version 1.1.0 @liyibass

### Notable Changes

-   feat: add custom PreviewApp to handle preview-related router
-   feat: add graphQL read access depends on server's type, such as CMS, QGL and PREVIEW
-   feat: add db schema sql for tv dev
-   feat: update atTracking field to handle timezone
-   feat: customize admin-ui component, such as SEARCH, LOGO and filter

### Commits

-   [[`8834354381`](https://github.com/mirror-media/openwarehouse/commit/8834354381)] - **chore**: update package.json's repo info (liyibass)
-   [[`9b015098b5`](https://github.com/mirror-media/openwarehouse/commit/9b015098b5)] - **chore**: add CHANGELOG.md (liyibass)
-   [[`a3b0fc2568`](https://github.com/mirror-media/openwarehouse/commit/a3b0fc2568)] - **chore**: update package.json#version to 1.1.0 (liyibass)
-   [[`cee2f4de29`](https://github.com/mirror-media/openwarehouse/commit/cee2f4de29)] - **fix**: set proxyTarget in createPreviewServerProxy (liyibass)
-   [[`5e56c09346`](https://github.com/mirror-media/openwarehouse/commit/5e56c09346)] - **feat**: add /api/\* router in PreviewApp (liyibass)
-   [[`63ac9024d3`](https://github.com/mirror-media/openwarehouse/commit/63ac9024d3)] - Merge pull request #45 from mirror-media/nuxt (LIYI)
-   [[`2273ddcd6a`](https://github.com/mirror-media/openwarehouse/commit/2273ddcd6a)] - **refactor**: update apiUrl in previewHandler (liyibass)
-   [[`23ce437905`](https://github.com/mirror-media/openwarehouse/commit/23ce437905)] - **refactor**: optimize PreviewApp's middleware structure (liyibass)
-   [[`9183c63213`](https://github.com/mirror-media/openwarehouse/commit/9183c63213)] - **refactor**: optimize previewBtn, udpate code structure (liyibass)
-   [[`1be16ebe99`](https://github.com/mirror-media/openwarehouse/commit/1be16ebe99)] - **fix**: update getPreviewUrl's get ApiUrl method (liyibass)
-   [[`25149d7bea`](https://github.com/mirror-media/openwarehouse/commit/25149d7bea)] - Feat/add db schema sql for tv dev (#36) (Baron Chiu)
-   [[`040138cbe4`](https://github.com/mirror-media/openwarehouse/commit/040138cbe4)] - Feat/add db schema sql for tv dev (#36) (Baron Chiu)
-   [[`c02cdeea3f`](https://github.com/mirror-media/openwarehouse/commit/c02cdeea3f)] - **feat**: update getApiUrl function in previewBtn (api endpoint depend on server type) (liyibass)
-   [[`431ff32c0b`](https://github.com/mirror-media/openwarehouse/commit/431ff32c0b)] - **feat**: change proxy target to localhost:3001 (liyibass)
-   [[`c93a3a157c`](https://github.com/mirror-media/openwarehouse/commit/c93a3a157c)] - **feat**: change route path from prevew to story (in order to proxy nuxt website correctly) (liyibass)
-   [[`d7eea41b44`](https://github.com/mirror-media/openwarehouse/commit/d7eea41b44)] - **refactor**: add router to handle webpack_hmr (liyibass)
-   [[`56c71128c5`](https://github.com/mirror-media/openwarehouse/commit/56c71128c5)] - **fix**: add additional router to handle nuxt file and api in preview page (liyibass)
-   [[`b344add3b7`](https://github.com/mirror-media/openwarehouse/commit/b344add3b7)] - **feat**: add additional router which handle huxt's corresponding file & api (liyibass)
-   [[`927125a13e`](https://github.com/mirror-media/openwarehouse/commit/927125a13e)] - **feat**: update preview url path, refactor PreviewBtn (liyibass)
-   [[`32b89aa04c`](https://github.com/mirror-media/openwarehouse/commit/32b89aa04c)] - **fix**: change preview url from id to slug (liyibass)
-   [[`dc7cc08451`](https://github.com/mirror-media/openwarehouse/commit/dc7cc08451)] - **feat**: migrate custom AddFilterPopout, adjust Options's maxheight to fix mobile issue (liyibass)
-   [[`f63e942157`](https://github.com/mirror-media/openwarehouse/commit/f63e942157)] - **feat**: add custom ActiveFilter from app-admin-ui (liyibass)
-   [[`37c3474bb5`](https://github.com/mirror-media/openwarehouse/commit/37c3474bb5)] - **feat**: update atTracking to NewDateTime in all lists (liyibass)
-   [[`39106ff367`](https://github.com/mirror-media/openwarehouse/commit/39106ff367)] - refactor(NewDateTime): remove unuse package and console.log (liyibass)
-   [[`ae9b2889c8`](https://github.com/mirror-media/openwarehouse/commit/ae9b2889c8)] - feat(atTracking): customize atTracking's field to NewDateTime, fix NewDateTime time error after saved (liyibass)
-   [[`61d727d406`](https://github.com/mirror-media/openwarehouse/commit/61d727d406)] - Merge pull request #40 from mirror-media/previewRouter (nick)
-   [[`285d375d1a`](https://github.com/mirror-media/openwarehouse/commit/285d375d1a)] - **feat**: add customize Search component in hook (liyibass)
-   [[`ec08fabe27`](https://github.com/mirror-media/openwarehouse/commit/ec08fabe27)] - **feat**: update User access control (liyibass)
-   [[`709b69f91a`](https://github.com/mirror-media/openwarehouse/commit/709b69f91a)] - **refactor**: adjust previewApp's folder structure, remove unuse console.log (liyibass)
-   [[`abd4f8d9fd`](https://github.com/mirror-media/openwarehouse/commit/abd4f8d9fd)] - **feat**: optimize image upload method and increase speed (liyibass)
-   [[`81a101a002`](https://github.com/mirror-media/openwarehouse/commit/81a101a002)] - **refactor**: change blockFieldToAnonymous's name to ListAccessHandler (liyibass)
-   [[`b8f95e4919`](https://github.com/mirror-media/openwarehouse/commit/b8f95e4919)] - **fix**: set yarn start back into keystone start (liyibass)
-   [[`6c588190d1`](https://github.com/mirror-media/openwarehouse/commit/6c588190d1)] - **refactor**: create new custom app 'PreviewApp' to handle preview route (liyibass)
-   [[`2671a4f871`](https://github.com/mirror-media/openwarehouse/commit/2671a4f871)] - **refactor**: set CMS as server's default type (liyibass)
-   [[`fee4f8dfe6`](https://github.com/mirror-media/openwarehouse/commit/fee4f8dfe6)] - **rafactor**: put input router into index.js (liyibass)
-   [[`f316626e7c`](https://github.com/mirror-media/openwarehouse/commit/f316626e7c)] - **rafactor**: set serviceType's value is came from process.env.K5_SERVICE_TYPE (liyibass)
-   [[`a656d7fffd`](https://github.com/mirror-media/openwarehouse/commit/a656d7fffd)] - **refactor**: remove unuse code (liyibass)
-   [[`bafeeb4207`](https://github.com/mirror-media/openwarehouse/commit/bafeeb4207)] - **feat**: make proxy target url (for tv's preview page) as process.env.K5_PREVIEW_URL (liyibass)
-   [[`ea60f2ba94`](https://github.com/mirror-media/openwarehouse/commit/ea60f2ba94)] - **feat**: update Post's read access control methods via K5_SERVICE_TYPE (liyibass)
-   [[`f36b87beb3`](https://github.com/mirror-media/openwarehouse/commit/f36b87beb3)] - **feat**: add preview router (liyibass)
-   [[`6eb3ae5c5b`](https://github.com/mirror-media/openwarehouse/commit/6eb3ae5c5b)] - Merge pull request #39 from nickhsine/docs-for-cicd (nick)
-   [[`727e857b06`](https://github.com/mirror-media/openwarehouse/commit/727e857b06)] - **docs**: update README.md. Add CI/CD documentation (nickhsine)
-   [[`d584b9c092`](https://github.com/mirror-media/openwarehouse/commit/d584b9c092)] - **feat**: adjust preview btn, show btn only in post list (liyibass)
-   [[`245ce4bf51`](https://github.com/mirror-media/openwarehouse/commit/245ce4bf51)] - **feat**: add gql anonymous filter in Post, EditorChoice and VideoEditorChoice (liyibass)
-   [[`3bc03ae96e`](https://github.com/mirror-media/openwarehouse/commit/3bc03ae96e)] - **feat**: update draft, update embedded code data property (liyibass)
-   [[`baf76225e8`](https://github.com/mirror-media/openwarehouse/commit/baf76225e8)] - feat(Preview): add preview btn and its basic function (liyibass)
-   [[`29f2689d40`](https://github.com/mirror-media/openwarehouse/commit/29f2689d40)] - **feat**: add new logos in login page (liyibass)

## Version 1.0.0

This is initial version.
