-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'YOUTUBE');

-- AlterTable
ALTER TABLE "HeroBanner" ADD COLUMN     "mediaType" "MediaType" NOT NULL DEFAULT 'IMAGE',
ADD COLUMN     "thumbnailUrl" TEXT,
ADD COLUMN     "youtubeUrl" TEXT,
ADD COLUMN     "youtubeVideoId" TEXT,
ALTER COLUMN "imageUrl" DROP NOT NULL,
ALTER COLUMN "imagePublicId" DROP NOT NULL;
