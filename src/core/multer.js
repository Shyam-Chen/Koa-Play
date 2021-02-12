import fs from 'fs';
import url from 'url';
import multer from '@koa/multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

let storage = multer.diskStorage({
  destination(req, file, done) {
    const dist = './uploads';
    if (!fs.existsSync(dist)) fs.mkdirSync(dist);
    return done(null, dist);
  },
  filename(req, file, done) {
    done(null, file.originalname);
  },
});

if (process.env.NODE_ENV === 'production') {
  const parseCloudinaryUrl = str => {
    const uri = url.parse(str, true);

    return {
      cloud_name: uri.host,
      api_key: uri.auth && uri.auth.split(':')[0],
      api_secret: uri.auth && uri.auth.split(':')[1],
      private_cdn: uri.pathname != null,
      secure_distribution: uri.pathname && uri.pathname.substring(1),
    };
  };

  cloudinary.config(parseCloudinaryUrl(process.env.CLOUDINARY_URL));

  storage = new CloudinaryStorage({
    cloudinary,
  });
}

export default multer({ storage });
