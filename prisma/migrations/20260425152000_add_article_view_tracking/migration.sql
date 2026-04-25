CREATE TABLE "ArticleView" (
  "id" TEXT NOT NULL,
  "articleSlug" TEXT NOT NULL,
  "locale" TEXT NOT NULL,
  "sessionHash" TEXT NOT NULL,
  "viewDate" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "ArticleView_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ArticleView_articleSlug_sessionHash_viewDate_key"
ON "ArticleView"("articleSlug", "sessionHash", "viewDate");

CREATE INDEX "ArticleView_articleSlug_viewDate_idx"
ON "ArticleView"("articleSlug", "viewDate");

CREATE INDEX "ArticleView_locale_viewDate_idx"
ON "ArticleView"("locale", "viewDate");

CREATE INDEX "ArticleView_createdAt_idx"
ON "ArticleView"("createdAt");
