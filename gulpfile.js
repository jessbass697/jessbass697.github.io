const gulp = require('gulp'),
      inject = require('gulp-inject'),
      imageResize = require('gulp-responsive'),
      gutil = require('gulp-util'),
      remove = require('gulp-clean'),
      watermark = require('gulp-watermark'),
      gm = require('gulp-gm'),
      exif = require('gulp-exif'),
      data = require('gulp-data'),
      extend = require('gulp-extend'),
      compass = require('gulp-compass'),
      htmlmin = require('gulp-htmlmin');

sassSources = ['components/sass/style.scss'];


gulp.task('compass', () => {
    gulp.src(sassSources)
        .pipe(compass({
         css:  'builds/development/css',
            sass: 'components/sass',
            image: 'builds/development/images',
            style: 'compressed'
    })
            .on('error', gutil.log))
        .pipe(gulp.dest('builds/development/css'))
});

gulp.task('removeImages', () => {
    gulp.src('builds/development/images', {read: false})
    .pipe(remove());
});

gulp.task('removeHtml', () => {
    gulp.src('builds/development/index.html', {read: false})
    .pipe(remove());
});

gulp.task('remove', ['removeImages', 'removeHtml']);

gulp.task('original', () => {
    gulp.src('components/images/*.{jpg,png}')
    .pipe(imageResize({
        '*': [{
        }],
    }, {
        quality: 70,
        progressive: true,
        withMetadata: true,
    }))
    .pipe(gulp.dest('builds/development/images/'));
});

gulp.task('resizeSmall', () => {
    gulp.src('components/images/*.{jpg,png}')
    .pipe(imageResize({
        '*': [{
            width: 576,
        }],
    }, {
        quality: 70,
        progressive: true,
    }))
    .pipe(gulp.dest('builds/development/images/small'));
});

gulp.task('resizeMedium', () => {
    gulp.src('components/images/*.{jpg,png}')
    .pipe(imageResize({
        '*': [{
            width: 768,
        }],
    }, {
        quality: 70,
        progressive: true,
    }))
    .pipe(gulp.dest('builds/development/images/medium'));
});

gulp.task('resizeLarge', () => {
    gulp.src('components/images/*.{jpg,png}')
    .pipe(imageResize({
        '*': [{
            width: 992,
        }],
    }, {
        quality: 70,
        progressive: true,
    }))
    .pipe(gulp.dest('builds/development/images/large'));
});

gulp.task('resizeXL', () => {
    gulp.src('components/images/*.{jpg,png}')
    .pipe(imageResize({
        '*': [{
            width: 1200,
        }],
    }, {
        quality: 70,
        progressive: true,
    }))
    .pipe(gulp.dest('builds/development/images/xl'));
});

gulp.task('resize', ['original', 'resizeSmall', 'resizeMedium', 'resizeLarge', 'resizeXL']);



gulp.task('watermark', () => {
    gulp.src('builds/development/images/small/*.jpg')
    .pipe(watermark({
        image: "components/watermarks/576.png",
        resize: '500x200',
        gravity: 'Center'
    }))
    .pipe(gulp.dest('builds/development/images/small'))

    gulp.src('builds/development/images/medium/*.jpg')
    .pipe(watermark({
        image: "components/watermarks/768.png",
        resize: '500x200',
        gravity: 'Center'
    }))
    .pipe(gulp.dest('builds/development/images/medium'))

    gulp.src('builds/development/images/large/*.jpg')
    .pipe(watermark({
        image: "components/watermarks/992.png",
        resize: '500x200',
        gravity: 'Center'
    }))
    .pipe(gulp.dest('builds/development/images/large'))

    gulp.src('builds/development/images/xl/*.jpg')
    .pipe(watermark({
        image: "components/watermarks/1200.png",
        resize: '500x200',
        gravity: 'Center'
    }))
    .pipe(gulp.dest('builds/development/images/xl'))

});


gulp.task(
    'inject', () => {
        return gulp.src('components/html/index.html')
        .pipe(inject(gulp.src('builds/development/images/*', {
            read: false
        }), {
            transform: function(filepath) {
                if (filepath.slice(-4) === '.jpg') {
                    return '<div class="gallery_product .col col-sm-6 col-xl-4 filter banksy"><picture><a class="image-link" href="images/large/' + filepath.slice(27) + '"><img class="img-fluid" src="images/' + filepath.slice(27) + '" sizes="(min-width: 1200px) 33.3vw, (min-width: 576px) 50vw, (min-width: 575px) 100vw" srcset="images/small/' + filepath.slice(27) + ' 576w, images/medium/' + filepath.slice(27) + ' 768w, images/large/' + filepath.slice(27) + ' 992w, images/xl/' + filepath.slice(27) + ' 1200w"></a></picture></div>';
                }
                return inject.transform.apply(inject.transform, arguments);
            },
        }))
        .pipe(gulp.dest('builds/development'))
    }
);

gulp.task('exif', () => {
    gulp.src('builds/development/images/*.jpg')
    .pipe(exif())
    .pipe(data(function(file) {
        let filename = file.path.substring(file.path.lastIndexOf('/') +64),
            data = {};
        data[filename] = {};
        data[filename]['Artist'] = file.exif.image.Artist;
        data[filename]['Date'] = file.exif.image.ModifyDate;
        data[filename]['Resolution'] = file.exif.thumbnail.XResolution;

        file.contents = new Buffer(JSON.stringify(data));
    }))
    .pipe(extend('exif.json', true, '    '))
    .pipe(gulp.dest('builds/development'));
});

gulp.task('htmlmin', () => {
    gulp.src('builds/development/*.html')
    .pipe(htmlmin({
        collapseWhitespace: true
    }))
    .pipe(gulp.dest('builds/production'))
});
