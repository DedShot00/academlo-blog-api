const { ref, getDownloadURL } = require('firebase/storage');
const PostImg = require('../models/postImg.model');
const Post = require('../models/post.model');
const User = require('../models/user.model');
const AppError = require('../utils/appError');
const storage = require('../utils/firebase');

class PostService {
  async findPost(id) {
    try {
      const post = await Post.findOne({
        where: {
          id,
          status: true,
        },
        attributes: {
          exclude: ['userId', 'status'],
        },
        include: [
          {
            model: User,
            attributes: ['name', 'profileImgUrl', 'description'],
          },
          {
            model: PostImg,
          },
        ],
      });

      if (!post) {
        throw new AppError('Post not found', 404);
      }

      return post;
    } catch (error) {
      throw new Error(error);
    }
  }

  async downloadPostImgs(post) {
    try {
      const userImgRef = ref(storage, post.user.profileImgUrl);
      const userProfileUrl = await getDownloadURL(userImgRef);

      post.user.profileImgUrl = userProfileUrl;

      const postImgsPromises = post.PostImgs.map(async (postImg) => {
        const imgRef = ref(storage, postImg.postImgUrl);
        const imgUrl =  await getDownloadURL(imgRef)

        postImg.postImgUrl = imgUrl

        return postImg
      });

      await Promise.all(postImgsPromises)
      return post

    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = PostService;
