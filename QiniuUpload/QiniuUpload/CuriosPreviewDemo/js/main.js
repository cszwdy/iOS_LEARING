/**
 * Created by Allen on 2015/5/7.
 */
(function(){
    var resPath = './res',
        fileID,
        fileAuthorID,
        mainHeight,
        mainWidth,
        mainTile,
        mainDesc,
        flipType,
        flipDirection,
        flipLoop,
        mainBackground,
        mainMusic,
        previewPageID,
        pagesPath,
        pages,
        publishDate;
    var fileScale,
        fileHeight,
        fileWidth;

    var currentSlideID,
        currentSlidePage,
        nextSlideID,
        nextSlidePage,
        preSlideID,
        preSlidePage,
        currentIndex;

    var deviceWidth,
        deviceHeight,
        phoneDevice;
    var pageSlideWidth,
        pageSlideHeight;
    var pageLoadIndex;
    var upArrowAni,
        bgMusicAni,
        isPlayBgMusic=false,
        isPlayingBgMusic=false;
    var MainFile = {
        init:function(mainJson){
            fileID         = mainJson.ID;
            fileAuthorID   = mainJson.AuthorID;
            mainWidth      = mainJson.MainWidth;
            mainHeight     = mainJson.MainHeight;
            mainTile       = mainJson.MainTitle;
            mainDesc       = mainJson.MainDesc;
            flipDirection  = mainJson.FlipDirection;
            flipType       = mainJson.FlipType;
            flipLoop       = mainJson.FlipLoop == 'true'?true:false;
            mainBackground = mainJson.MainBackground;
            mainMusic      = mainJson.MainMusic;
            previewPageID  = mainJson.PreviewPageID;
            pagesPath      = mainJson.PagesPath;
            pages          = mainJson.Pages;
            publishDate    = mainJson.PublishDate;

            this.setScreenSize();
            this.changeViewsport();
            this.setMainDiv();
            this.loadPageJson();

            $(window).on('resize', function() {
                if(!phoneDevice){
                    MainFile.setScreenSize();
                    MainFile.setMainDivCss();
                    setCurrentPage();
                    resetSlidePostition();
                }
            });
        },

        setScreenSize:function(){
            deviceWidth = $(window).width();
            deviceHeight = $(window).height();

            var c1 = mainWidth / mainHeight;
            var c2 = deviceWidth / deviceHeight;
            if (c1 > c2) {
                fileScale = deviceWidth / mainWidth;
            }else {
                fileScale = deviceHeight / mainHeight;
            }
            fileWidth = fileScale * mainWidth;
            fileHeight = fileScale * mainHeight;
        },

        changeViewsport:function(){
            var ua = navigator.userAgent;
            if (/Android(\d+\.\d+)/.test(ua)) {
                var version = parseFloat(RegExp.$1);
                // andriod 2.3
                if (version > 2.3) {
                    document.write('<meta name="viewport" content="width=' + mainWidth + ', minimum-scale=' + fileScale + ', maximum-scale=' + fileScale + ', target-densitydpi=device-dpi", user-scalable=no/>');
                    // andriod 2.3����
                } else {
                    document.write('<meta name="viewport" content="width=' + mainWidth + ', target-densitydpi=device-dpi" user-scalable=no/>');
                }
                phoneDevice = true;
                // ios
            } else if (/iPhone/.test(ua) || /iPad/.test(ua)) {
                //document.write('<meta name="viewport" content="width=' + deviceWidth + ', user-scalable=no, target-densitydpi=device-dpi"/>');
                phoneDevice = true;
            }else {
                phoneDevice = false;
                //document.write('<meta name="viewport" content="width='+fileWidth+', user-scalable=yes">')
            }
        },

        setMainDiv:function(){
            var mainDevClass   = '<div id="'+"mainDiv"+'"/>';
            $("body").append(mainDevClass);
            var slideContaierDivClass = '<div class="'+"slideContainer"+'"/>';
            $("#mainDiv").append(slideContaierDivClass);
            $(".slideContainer")[0].addEventListener('touchstart', function(event){
                event.preventDefault();
            }, false);
            if(pages.length > 0){
                var upArrowDivClass = '<img class="'+"upArrow"+'" src="images/upArrow.png"/>';
                $("#mainDiv").append(upArrowDivClass);
            }
            if(mainMusic != "" && mainMusic != null){
                var bgMusicDivClass = '<div class="'+"bgMusic"+'"/>';
                $("#mainDiv").append(bgMusicDivClass);
                if(phoneDevice){
                    $(".bgMusic")[0].addEventListener('touchend', function(event){
                        if(isPlayBgMusic){
                            MainFile.stopBgMusic();
                        }else{
                            MainFile.playBgMusic();
                        }
                    }, false);
                }else{
                    $(".bgMusic")[0].addEventListener('mousedown', function(event){
                        if(isPlayBgMusic){
                            MainFile.stopBgMusic();
                        }else{
                            MainFile.playBgMusic();
                        }
                    }, true);
                }
                setTimeout(function(){
                    MainFile.playBgMusic();
                }, 20);
            }
            this.setMainDivCss();
        },

        setMainDivCss:function(){
            $("#mainDiv").css({
                "position":"absolute",
                "left": "0px",
                "top": "0px",
                "width": deviceWidth,
                "height": deviceHeight,
                "background-color": "black"
            });
            if(phoneDevice){
                pageSlideWidth  = deviceWidth;
                pageSlideHeight = deviceHeight;
            }else{
                pageSlideWidth  = fileWidth;
                pageSlideHeight = fileHeight;
            }
            $(".slideContainer").css({
                "position":"relative",
                "width": pageSlideWidth + "px",
                "height": pageSlideHeight + "px",
                "margin": "0 auto",
                "-webkit-perspective":"1200px",
                "-moz-perspective":"1200px",
                "-ms-perspective":"1200px",
                "perspective":"1200px"
            });
            if (mainBackground != "" && mainBackground != null) {
                $(".slideContainer").css({
                    "background": "url(" + resPath + mainBackground + ")",
                    "-moz-background-size": "100% 100%",
                    "background-size": "100% 100%",
                    "background-repeat": "no-repeat"
                });
            }
            if(mainMusic != "" && mainMusic != null){
                if(isPlayBgMusic){
                    this.stopBgMusicAni();
                }
                this.setBgMusicStyle();
                if(isPlayBgMusic){
                    this.playBgMusicAni();
                }
            }
            if(pages.length > 0){
                if(upArrowAni != null){
                    upArrowAni.stop();
                }
                var upArrowWidth  = fileScale*60;
                var upArrowHeight = fileScale*52;
                var upArrowLeft   = (deviceWidth - upArrowWidth)/2;
                var upArrowTop  =  deviceHeight-fileScale*72;
                $(".upArrow").css({
                    "position":"absolute",
                    "width":   upArrowWidth+ "px",
                    "height":  upArrowHeight+ "px",
                    "left":    upArrowLeft+"px",
                    "top":  upArrowTop+"px",
                    "zIndex":"1"
                });
                var upArrowImg = $(".upArrow")[0];
                upArrowAni = CuriosAnim.createNew( {
                    obj: upArrowImg,
                    delay: 0,
                    duration: 1000,
                    repeat:0,
                    endFrames: [{
                        frameAlpha:0,
                        frameY:deviceHeight-fileScale*124
                    }]
                });
                upArrowAni.play();
            }
        },

        setBgMusicStyle:function(){
            var bgMusicWidth  = fileScale*70;
            var bgMusicHeight = fileScale*70;
            var bgMusicLeft   = (deviceWidth + pageSlideWidth)/2 - fileScale*90;
            var bgMusicTop    =  fileScale*20;
            var bgMusicPath;
            if(isPlayBgMusic){
                bgMusicPath  = "images/audioPlay.png";
            }else{
                bgMusicPath  = "images/audioStop.png";
            }
            $(".bgMusic").css({
                "position":"absolute",
                "width":   bgMusicWidth+ "px",
                "height":  bgMusicHeight+ "px",
                "left":    bgMusicLeft+"px",
                "top":     bgMusicTop+"px",
                "zIndex":"1",
                "background": "url(" + bgMusicPath + ")",
                "-moz-background-size": "100% 100%",
                "background-size": "100% 100%",
                "background-repeat": "no-repeat"
            });
        },

        playBgMusic:function(){
            if(!isPlayingBgMusic){
                this.playBgMusicAni();
            }
            isPlayingBgMusic = true;
            isPlayBgMusic    = true;
            this.setBgMusicStyle();
        },

        stopBgMusic:function(){
            if(isPlayingBgMusic){
                this.stopBgMusicAni();
            }
            isPlayingBgMusic = false;
            isPlayBgMusic    = false;
            this.setBgMusicStyle();
        },

        playBgMusicAni:function(){
            if(bgMusicAni == null){
                var bgMusicImg = $(".bgMusic")[0];
                bgMusicAni = CuriosAnim.createNew( {
                    obj: bgMusicImg,
                    delay: 0,
                    duration: 2000,
                    repeat:0,
                    endFrames: [{
                        frameRotation:360
                    }]
                });
                bgMusicAni.play();
            }
        },

        stopBgMusicAni:function(){
            if(bgMusicAni != null){
                bgMusicAni.stop();
                bgMusicAni = null;
                var bgMusicImg = $(".bgMusic")[0];
                var es = bgMusicImg.style;
                var rotationStr = 'rotate('+0+'deg) ';
                es.webkitTransform = es.MsTransform = es.msTransform = es.MozTransform = es.OTransform = es.transform = rotationStr;
            }
        },

        loadPageJson:function(){
            pageLoadIndex = 0;
            this.loadSignPageJson();
        },

        loadSignPageJson:function(){
            if(pageLoadIndex < pages.length){
                var pageObject = pages[pageLoadIndex];
                var signPath = pageObject.Path;
                var pageIndex = pageObject.Index;
                var pageID    = pageObject.PageID;
                var pagePath = resPath + pagesPath+signPath;
                var pageJson;
                for(var i=0; i < curiosPagesJson.length; i++){
                    var signJson = curiosPagesJson[i];
                    if(signJson.ID == pageID){
                        pageJson = signJson;
                        break;
                    }
                }
                if(pageJson != null){
                    var pageClass =  PageClass.createNew(pageJson, pagePath);
                    pages.splice(pageLoadIndex,1,pageClass);
                }else{
                    pages.splice(pageLoadIndex,1);
                }
                pageLoadIndex++;
                MainFile.loadSignPageJson();
            }else{
                initSlidePage();
            }
        }
    };

    var initSlidePage = function(){
        switch (flipType){
            case "translate3d":
                var translateClass = TranslateSlideClass.createNew();
                translateClass.init();
                break;
            default :
                break;
        }
    };

    var resetSlidePostition = function(){
        switch (flipType){
            case "translate3d":
                var translateClass = TranslateSlideClass.createNew();
                translateClass.resetPosition();
                break;
            default :
                break;
        }
    };

    var getPageClassByID = function(pageID){
        for(var i=0 ; i < pages.length; i ++){
            var pageClass = pages[i];
            if(pageClass.pageID == pageID){
                return pageClass;
            }
        }
        return null;
    };

    var setCurrentPage = function(currentPageLoadedFunc, nextPageLoadedFunc, prePageLoadedFunc){
        var currentPageClass = pages[currentIndex];
        currentSlideID = currentPageClass.pageID;
        var currentPageJquery  =  $("#"+currentSlideID);
        if(currentPageJquery.length == 0){
            currentPageClass.initView(currentPageLoadedFunc);
        }else{
            currentPageClass.resetSize();
            if(currentPageLoadedFunc != null){
                currentPageLoadedFunc();
            }
        }
        currentSlidePage   = $("#"+currentSlideID)[0];

        var nextIndex = -1;
        if(currentIndex == pages.length -1){
            if(flipLoop){
                nextIndex = 0;
            }
        }else{
            nextIndex = currentIndex + 1;
        }

        var preIndex = -1;
        if(currentIndex == 0) {
            if(flipLoop){
                preIndex = pages.length - 1;
            }
        }else{
            preIndex = currentIndex - 1;
        }

        if(nextIndex == -1|| (preIndex == nextIndex && currentIndex == pages.length -1)){
            nextSlideID   = null;
            nextSlidePage = null;
            if(nextPageLoadedFunc != null){
                nextPageLoadedFunc();
            }
        }else{
            var nextPageClass = pages[nextIndex];
            nextSlideID = nextPageClass.pageID;
            var nextPageJquery  =  $("#"+nextSlideID);
            if(nextPageJquery.length == 0){
                nextPageClass.initView(nextPageLoadedFunc);
            }else{
                nextPageClass.resetSize();
                if(nextPageLoadedFunc != null){
                    nextPageLoadedFunc();
                }
            }
            nextSlidePage  =  $("#"+nextSlideID)[0];
        }

        if(preIndex == -1 || (preIndex == nextIndex && currentIndex == 0)){
            preSlideID   = null;
            preSlidePage = null;
            if(prePageLoadedFunc != null){
                prePageLoadedFunc();
            }
        }else{
            var prePageClass = pages[preIndex];
            preSlideID = prePageClass.pageID;
            var prePageJquery  =  $("#"+preSlideID);
            if(prePageJquery.length == 0){
                prePageClass.initView(prePageLoadedFunc);
            }else{
                prePageClass.resetSize();
                if(prePageLoadedFunc != null){
                    prePageLoadedFunc();
                }
            }
            preSlidePage  =  $("#"+preSlideID)[0];
        }
    };

    var TranslateSlideClass = {
        createNew:function(){
            var translateSlideClass = {};

            var beginSlideTime;
            var isBeginSlide;
            var slideBeginX;
            var slideBeginY;
            var startX;
            var startY;
            var isPlayAnimation = false;
            var isLoadComplete  = false;
            var slideDir        = '';

            translateSlideClass.init = function(){
                currentIndex = 0;
                if(previewPageID != null){
                    for(var i = 0 ; i < pages.length; i++){
                        var pageClass = pages[i];
                        if(pageClass.pageID == previewPageID){
                            currentIndex = i;
                            break;
                        }
                    }
                }
                setCurrentPage(function(){
                    isLoadComplete = true;
                    var currentPageClass = pages[currentIndex];
                    currentPageClass.beginView();
                },null,null);
                setPagePosition();
                addCurrentPageEvent();
            };

            translateSlideClass.resetPosition = function(){
                setPagePosition();
            };

            var setPagePosition = function(){
                var currentSlidePageWidth  = parseFloat(GetCurrentStyle(currentSlidePage,"width"));
                var currentSlidePageHeight = parseFloat(GetCurrentStyle(currentSlidePage, "height"));
                var es = currentSlidePage.style;
                es.left = (pageSlideWidth-currentSlidePageWidth)/2+"px";
                es.top  = (pageSlideHeight-currentSlidePageHeight)/2+"px";
                es.zIndex = 0;
                es.webkitTransformStyle = es.MsTransformStyle = es.msTransformStyle = es.MozTransformStyle = es.OTransformStyle = es.transformStyle = "preserve-3d";
                if(nextSlideID != null && nextSlidePage != null){
                    var nextSlidePageWidth  = parseFloat(GetCurrentStyle(nextSlidePage,"width"));
                    var nextSlidePageHeight = parseFloat(GetCurrentStyle(nextSlidePage,"height"));
                    if(flipDirection == 'ver'){
                        nextSlidePage.style.left = (pageSlideWidth-nextSlidePageWidth)/2+"px";
                        nextSlidePage.style.top  = pageSlideHeight+"px";
                    }else if(flipDirection == 'hor'){
                        nextSlidePage.style.left = pageSlideWidth+"px";
                        nextSlidePage.style.top  = (pageSlideHeight-nextSlidePageHeight)/2+"px";
                    }
                    nextSlidePage.style.zIndex = 1;
                    $("#"+nextSlideID).hide();
                }
                if(preSlideID != null && preSlidePage != null){
                    var preSlidePageWidth  = parseFloat(GetCurrentStyle(preSlidePage,"width"));
                    var preSlidePageHeight = parseFloat(GetCurrentStyle(preSlidePage, "height"));
                    if(flipDirection == 'ver'){
                        preSlidePage.style.left = (pageSlideWidth-preSlidePageWidth)/2+"px";
                        preSlidePage.style.top  = 0-preSlidePageHeight+"px";
                    }else if(flipDirection == 'hor'){
                        preSlidePage.style.left = 0-preSlidePageWidth+"px";
                        preSlidePage.style.top  = (pageSlideHeight-preSlidePageHeight)/2+"px";
                    }
                    preSlidePage.style.zIndex = 1;
                    $("#"+preSlideID).hide();
                }
            };

            var addCurrentPageEvent = function(){
                currentSlidePage.addEventListener('mousedown', mouseDown, true);
                // Events exclusive to touch devices
                currentSlidePage.addEventListener('touchstart', touchStart, false);
            };

            var removeCurrentPageEvent = function(){
                currentSlidePage.removeEventListener('mousedown', mouseDown, true);
                // Events exclusive to touch devices
                currentSlidePage.removeEventListener('touchstart', touchStart, false);
            };

            var mouseDown = function(event){
                if(isLoadComplete){
                    currentSlidePage.addEventListener('mousemove', mouseMove, true);
                    currentSlidePage.addEventListener('mouseup', mouseUp, true);
                    var x = event.pageX,
                        y = event.pageY;
                    beginSlide(x,y);
                }
            };

            var mouseMove = function(event){
                var x = event.pageX,
                    y = event.pageY;
                divSlide(x,y);
            };

            var mouseUp = function(event){
                currentSlidePage.removeEventListener('mousemove', mouseMove, true);
                currentSlidePage.removeEventListener('mouseup', mouseUp, true);
                var x = event.pageX,
                    y = event.pageY;
                slideEnd(x,y);
            };

            var touchStart = function(event){
                event.preventDefault();
                if(isLoadComplete){
                    if(event.touches.length == 1)
                    {
                        currentSlidePage.addEventListener('touchmove', touchMove, false);
                        currentSlidePage.addEventListener('touchend', touchEnd, false);
                        var touch = event.touches[0],
                            x = touch.pageX,
                            y = touch.pageY;
                        beginSlide(x,y);
                    }
                }
            };

            var touchMove = function(event){
                event.preventDefault();
                if(event.touches.length == 1)
                {
                    var touch = event.touches[0],
                        x = touch.pageX,
                        y = touch.pageY;
                    divSlide(x,y);
                }
            };

            var touchEnd = function(event){
                event.preventDefault();
                currentSlidePage.removeEventListener('touchmove', touchMove, false);
                currentSlidePage.removeEventListener('touchend', touchEnd, false);
                slideEnd();
            };

            var beginSlide = function(x, y){
                if(isPlayAnimation){
                    return;
                }
                var d = new Date();
                beginSlideTime = d.getTime();
                isBeginSlide = true;
                startX = x;
                startY = y;
                slideBeginX = x;
                slideBeginY = y;
                if(nextSlideID != null){
                    $("#"+nextSlideID).show();
                }
                if(preSlideID != null){
                    $("#"+preSlideID).show();
                }
            };

            var divSlide = function(x,y){
                if(isPlayAnimation){
                    return;
                }
                if(isBeginSlide) {
                    switch (flipDirection) {
                        case 'ver':
                            verSlide(y);
                            break;
                        case 'hor':
                            horSlide(x);
                            break;
                        default :
                            break;
                    }
                    slideBeginX = x;
                    slideBeginY = y;
                }
            };

            var slideEnd = function(x, y){
                if(isPlayAnimation){
                    return;
                }
                var endX = x===undefined?slideBeginX:x;
                var endY = y===undefined?slideBeginY:y;
                isBeginSlide = false;
                var d = new Date();
                var endSlideTime = d.getTime();
                if((endSlideTime - beginSlideTime) > 10){
                    switch (flipDirection) {
                        case 'ver':
                            verSlideAnimation(endY);
                            break;
                        case 'hor':
                            horSlideAnimation(endX);
                            break;
                        default :
                            break;
                    }
                }else{
                    if(nextSlideID != null){
                        $("#"+nextSlideID).hide();
                    }
                    if(preSlideID != null){
                        $("#"+preSlideID).hide();
                    }
                }
            };

            var verSlide = function(y){
                var changeY = y - slideBeginY;
                var beginChangeY = y - startY;
                var translate, scale;
                var progress;
                var preTop;
                var nextTop;
                if(preSlideID != null && preSlidePage != null){
                    preTop = parseFloat(GetCurrentStyle(preSlidePage, "top"))+changeY;
                    preSlidePage.style.top = preTop +'px';
                }
                if(nextSlideID != null && nextSlidePage != null){
                    nextTop = parseFloat(GetCurrentStyle(nextSlidePage, "top"))+changeY;
                    nextSlidePage.style.top = nextTop +'px';
                }
                if(changeY > 0){
                    slideDir = 'pre';
                }else if(changeY < 0){
                    slideDir = 'next';
                }else{
                    slideDir = '';
                }
                if(beginChangeY > 0){
                    if(preSlideID != null && preSlidePage != null){
                        var preSlidePageHeight = parseFloat(GetCurrentStyle(preSlidePage, "height"));
                        progress = (preTop + preSlidePageHeight) / pageSlideHeight;
                    } else{
                        progress = beginChangeY/pageSlideHeight*0.2;
                    }
                }else if(beginChangeY < 0){
                    if(nextSlideID != null && nextSlidePage != null){
                        progress = (nextTop - pageSlideHeight) / pageSlideHeight;
                    } else{
                        progress = beginChangeY/pageSlideHeight*0.2;
                    }
                }else {
                    progress = 0;
                }
                var es = currentSlidePage.style;
                var currentSlidePageHeight =parseFloat(GetCurrentStyle(currentSlidePage, "height"));
                scale = 1 - Math.min(Math.abs(progress * 0.2), 1);
                if(beginChangeY < 0){
                    translate = (scale - 1) * currentSlidePageHeight/2;
                }else if(beginChangeY > 0){
                    translate  = (1 - scale) * currentSlidePageHeight/2;
                }
                var scaleStr        = 'scale(' + scale + ')';
                var translateStr    = 'translate3d(0,' + (translate) + 'px,0) ';
                es.webkitTransform = es.MsTransform = es.msTransform = es.MozTransform = es.OTransform = es.transform = translateStr +  scaleStr ;
            };

            var horSlide = function(x){
                var changeX = x - slideBeginX;
                var beginChangeX = x - startX;
                var translate, scale;
                var progress;
                var preLeft;
                var nextLeft;
                if(preSlideID != null && preSlidePage != null){
                    preLeft = parseFloat(GetCurrentStyle(preSlidePage, "left"))+changeX;
                    preSlidePage.style.left = preLeft +'px';
                }
                if(nextSlideID != null && nextSlidePage != null){
                    nextLeft = parseFloat(GetCurrentStyle(nextSlidePage, "left"))+changeX;
                    nextSlidePage.style.left = nextLeft +'px';
                }
                if(changeX > 0){
                    slideDir = 'pre';
                }else if(changeX < 0){
                    slideDir = 'next';
                }else{
                    slideDir = '';
                }
                if(beginChangeX > 0){
                    if(preSlideID != null && preSlidePage != null){
                        var preSlidePageWidth = parseFloat(GetCurrentStyle(preSlidePage, "width"));
                        progress = (preLeft + preSlidePageWidth) / pageSlideWidth;
                    } else{
                        progress = beginChangeX/pageSlideWidth*0.2;
                    }
                }else if(beginChangeX < 0){
                    if(nextSlideID != null && nextSlidePage != null){
                        progress = (nextLeft - pageSlideWidth) / pageSlideWidth;
                    } else{
                        progress = beginChangeX/pageSlideWidth*0.2;
                    }
                }else {
                    progress = 0;
                }
                var es = currentSlidePage.style;
                var currentSlidePageWidth =parseFloat(GetCurrentStyle(currentSlidePage, "width"));
                scale = 1 - Math.min(Math.abs(progress * 0.2), 1);
                if(beginChangeX < 0){
                    translate = (scale - 1) * currentSlidePageWidth/2;
                }else if(beginChangeX > 0){
                    translate  = (1 - scale) * currentSlidePageWidth/2;
                }
                var scaleStr        = 'scale(' + scale + ')';
                var translateStr    = 'translate3d(' + (translate) + 'px,0,0) ';
                es.webkitTransform = es.MsTransform = es.msTransform = es.MozTransform = es.OTransform = es.transform = translateStr +  scaleStr ;
            };

            var verSlideAnimation = function(y){
                var beginChangeY = y - startY;
                var finallyScale = 0.8;
                var currentSlidePageHeight = parseFloat(GetCurrentStyle(currentSlidePage, "height"));
                if(beginChangeY > 5){
                    if(preSlideID != null && preSlidePage != null){
                        if(slideDir != 'pre'){
                            resetCurrentPage();
                        }else{
                            var preSlidePageHeight = parseFloat(GetCurrentStyle(preSlidePage, "height"));
                            var preTop             = parseFloat(GetCurrentStyle(preSlidePage, "top"));
                            var progress           = (0 - preTop)/preSlidePageHeight;
                            var time               = progress * 500 < 100 ? 100 : progress * 500;
                            var preSlideAnimation = CuriosAnim.createNew( {
                                obj: preSlidePage,
                                delay: 0,
                                duration: time,
                                endFrames: [{
                                    frameY:(pageSlideHeight - preSlidePageHeight)/2
                                }]
                            });
                            preSlideAnimation.play();
                            var finallyTranslateY = (1-finallyScale) * currentSlidePageHeight/2;
                            var currentSlideAnimation = CuriosAnim.createNew( {
                                obj: currentSlidePage,
                                delay: 0,
                                duration: time,
                                endFrames: [{
                                    frameScaleX:finallyScale,
                                    frameScaleY:finallyScale,
                                    frameTranslateY:finallyTranslateY
                                }],
                                frameEnd: function () {
                                    preAnimationEnd();
                                }
                            });
                            isPlayAnimation = true;
                            currentSlideAnimation.play();
                        }
                    }else{
                        resetCurrentPage();
                    }
                    if(nextSlideID != null && nextSlidePage != null){
                        var nextSlidePageWidth  = parseFloat(GetCurrentStyle(nextSlidePage,"width"));
                        nextSlidePage.style.left = (pageSlideWidth-nextSlidePageWidth)/2+"px";
                        nextSlidePage.style.top  = pageSlideHeight+"px";
                    }
                }else if(beginChangeY < -5){
                    if(nextSlideID != null && nextSlidePage != null){
                        if(slideDir != 'next'){
                            resetCurrentPage();
                        }else{
                            var nextSlidePageHeight = parseFloat(GetCurrentStyle(nextSlidePage, "height"));
                            var nextTop            = parseFloat(GetCurrentStyle(nextSlidePage, "top"));
                            var progress           = nextTop/nextSlidePageHeight;
                            var time               = progress * 500 < 100 ? 100 : progress * 500;
                            var nextSlideAnimation = CuriosAnim.createNew( {
                                obj: nextSlidePage,
                                delay: 0,
                                duration: time,
                                endFrames: [{
                                    frameY:(pageSlideHeight - nextSlidePageHeight)/2
                                }]
                            });
                            nextSlideAnimation.play();
                            var finallyTranslateY = (finallyScale - 1) * currentSlidePageHeight/2;
                            var currentSlideAnimation = CuriosAnim.createNew( {
                                obj: currentSlidePage,
                                delay: 0,
                                duration: time,
                                endFrames: [{
                                    frameScaleX:finallyScale,
                                    frameScaleY:finallyScale,
                                    frameTranslateY:finallyTranslateY
                                }],
                                frameEnd: function () {
                                    nextAnimationEnd();
                                }
                            });
                            isPlayAnimation = true;
                            currentSlideAnimation.play();
                        }
                    }else{
                        resetCurrentPage();
                    }
                    if(preSlideID != null && preSlidePage != null){
                        var preSlidePageWidth  = parseFloat(GetCurrentStyle(preSlidePage,"width"));
                        var preSlidePageHeight = parseFloat(GetCurrentStyle(preSlidePage, "height"));
                        preSlidePage.style.left = (pageSlideWidth-preSlidePageWidth)/2+"px";
                        preSlidePage.style.top  = 0-preSlidePageHeight+"px";
                    }
                }else{
                    if(nextSlideID != null){
                        $("#"+nextSlideID).hide();
                    }
                    if(preSlideID != null){
                        $("#"+preSlideID).hide();
                    }
                    resetCurrentPage();
                }
            };

            var horSlideAnimation = function(x){
                var beginChangeX = x - startX;
                var finallyScale = 0.8;
                var currentSlidePageWidth = parseFloat(GetCurrentStyle(currentSlidePage, "width"));
                if(beginChangeX > 5){
                    if(preSlideID != null && preSlidePage != null){
                        var preSlidePageWidth = parseFloat(GetCurrentStyle(preSlidePage, "width"));
                        var preLeft           = parseFloat(GetCurrentStyle(preSlidePage, "left"));
                        var progress          = (0 - preLeft)/preSlidePageWidth;
                        var time              = progress * 500 < 100 ? 100 : progress * 500;
                        var preSlideAnimation = CuriosAnim.createNew( {
                            obj: preSlidePage,
                            delay: 0,
                            duration: time,
                            endFrames: [{
                                frameX:(pageSlideWidth - preSlidePageWidth)/2
                            }]
                        });
                        preSlideAnimation.play();
                        var finallyTranslateX = (1-finallyScale) * currentSlidePageWidth/2;
                        var currentSlideAnimation = CuriosAnim.createNew( {
                            obj: currentSlidePage,
                            delay: 0,
                            duration: time,
                            endFrames: [{
                                frameScaleX:finallyScale,
                                frameScaleY:finallyScale,
                                frameTranslateX:finallyTranslateX
                            }],
                            frameEnd: function () {
                                preAnimationEnd();
                            }
                        });
                        isPlayAnimation = true;
                        currentSlideAnimation.play();
                    }else{
                        resetCurrentPage();
                    }
                    if(nextSlideID != null && nextSlidePage != null){
                        var nextSlidePageWidth  = parseFloat(GetCurrentStyle(nextSlidePage,"width"));
                        var nextSlidePageHeight = parseFloat(GetCurrentStyle(nextSlidePage,"height"));
                        preSlidePage.style.left = pageSlideWidth+"px";
                        preSlidePage.style.top  = (pageSlideHeight-nextSlidePageWidth)/2+"px";
                    }
                }else if(beginChangeX < -5){
                    if(nextSlideID != null && nextSlidePage != null){
                        var nextSlidePageWidth = parseFloat(GetCurrentStyle(nextSlidePage, "width"));
                        var nextLeft           = parseFloat(GetCurrentStyle(nextSlidePage, "left"));
                        var progress           = nextLeft/nextSlidePageWidth;
                        var time               = progress * 500 < 100 ? 100 : progress * 500;
                        var nextSlideAnimation = CuriosAnim.createNew( {
                            obj: nextSlidePage,
                            delay: 0,
                            duration: time,
                            endFrames: [{
                                frameX:(pageSlideWidth - nextSlidePageWidth)/2
                            }]
                        });
                        nextSlideAnimation.play();
                        var finallyTranslateX = (finallyScale - 1) * currentSlidePageWidth/2;
                        var currentSlideAnimation = CuriosAnim.createNew( {
                            obj: currentSlidePage,
                            delay: 0,
                            duration: time,
                            endFrames: [{
                                frameScaleX:finallyScale,
                                frameScaleY:finallyScale,
                                frameTranslateX:finallyTranslateX
                            }],
                            frameEnd: function () {
                                nextAnimationEnd();
                            }
                        });
                        isPlayAnimation = true;
                        currentSlideAnimation.play();
                    }else{
                        resetCurrentPage();
                    }
                    if(preSlideID != null && preSlidePage != null){
                        var preSlidePageWidth  = parseFloat(GetCurrentStyle(preSlidePage,"width"));
                        var preSlidePageHeight = parseFloat(GetCurrentStyle(preSlidePage, "height"));
                        preSlidePage.style.left = 0-preSlidePageWidth+"px";
                        preSlidePage.style.top  = (pageSlideHeight-preSlidePageHeight)/2+"px";
                    }
                }else{
                    if(nextSlideID != null){
                        $("#"+nextSlideID).hide();
                    }
                    if(preSlideID != null){
                        $("#"+preSlideID).hide();
                    }
                    resetCurrentPage();
                }
            };

            var resetCurrentPage = function(){

                if(preSlideID != null && preSlidePage != null){
                    switch (flipDirection) {
                        case 'ver':
                            resetVerPrePage();
                            break;
                        case 'hor':
                            resetHorPrePage();
                            break;
                        default :
                            break;
                    }
                }

                if(nextSlideID != null && nextSlidePage != null){
                    switch (flipDirection){
                        case 'ver':
                            resetVerNextPage();
                            break;
                        case 'hor':
                            resetHorNextPage();
                            break;
                        default :
                            break;
                    }

                }

                var currentSlideAnimation = CuriosAnim.createNew( {
                    obj: currentSlidePage,
                    delay: 0,
                    duration: 100,
                    endFrames: [{
                        frameScaleX:1,
                        frameScaleY:1,
                        frameTranslateY:0,
                        frameTranslatex:0
                    }],
                    frameEnd: function () {
                        isPlayAnimation = false;
                    }
                });
                isPlayAnimation = true;
                currentSlideAnimation.play();
            };

            var resetVerPrePage = function(){
                var preSlidePageHeight = parseFloat(GetCurrentStyle(preSlidePage, "height"));
                var preSlideAnimation = CuriosAnim.createNew({
                    obj: preSlidePage,
                    delay: 0,
                    duration: 100,
                    endFrames: [{
                        frameY:0-preSlidePageHeight
                    }]
                });
                preSlideAnimation.play();
            };

            var resetVerNextPage = function(){
                var nextSlideAnimation = CuriosAnim.createNew({
                    obj: nextSlidePage,
                    delay: 0,
                    duration: 100,
                    endFrames: [{
                        frameY:pageSlideHeight
                    }]
                });
                nextSlideAnimation.play();
            };

            var resetHorPrePage = function(){
                var preSlidePageWidth  = parseFloat(GetCurrentStyle(preSlidePage,"width"));
                var preSlideAnimation = CuriosAnim.createNew({
                    obj: preSlidePage,
                    delay: 0,
                    duration: 100,
                    endFrames: [{
                        frameX:0-preSlidePageWidth
                    }]
                });
                preSlideAnimation.play();
            };

            var resetHorNextPage = function(){
                var nextSlideAnimation = CuriosAnim.createNew({
                    obj: nextSlidePage,
                    delay: 0,
                    duration: 100,
                    endFrames: [{
                        frameY:pageSlideWidth
                    }]
                });
                nextSlideAnimation.play();
            };

            var nextAnimationEnd = function(){
                resetCurrentSlide();
                if(currentIndex == pages.length-1){
                    if(flipLoop){
                        currentIndex = 0;
                    }
                }else{
                    currentIndex ++ ;
                }
                if(preSlideID != null && preSlidePage != null){
                    var preClass = getPageClassByID(preSlideID);
                    preClass.removeView();
                }
                if(currentSlideID != null && currentSlidePage != null){
                    var currentClass = getPageClassByID(currentSlideID);
                    currentClass.release();
                }
                setCurrentPage(null,function(){
                    isLoadComplete = true;
                },null);

                var currentPageClass = pages[currentIndex];
                currentPageClass.beginView();
                addCurrentPageEvent();
                setPagePosition();
                isPlayAnimation = false;
            };

            var preAnimationEnd = function(){
                resetCurrentSlide();
                if(currentIndex == 0 ){
                    if(flipLoop){
                        currentIndex = pages.length - 1
                    }
                }else{
                    currentIndex -- ;
                }
                if(nextSlideID != null && nextSlidePage != null){
                    var nextClass = getPageClassByID(nextSlideID);
                    nextClass.removeView();
                }
                if(currentSlideID != null && currentSlidePage != null){
                    var currentClass = getPageClassByID(currentSlideID);
                    currentClass.release();
                }
                setCurrentPage(null,null,function(){
                    isLoadComplete = true;
                });
                var currentPageClass = pages[currentIndex];
                currentPageClass.beginView();
                addCurrentPageEvent();
                setPagePosition();
                isPlayAnimation = false;
            };

            var resetCurrentSlide = function(){
                var es = currentSlidePage.style;
                var scaleStr        = 'scale(' + 1 + ')';
                var translateStr    = 'translate3d(0,' + 0 + 'px,0) ';
                es.webkitTransform = es.MsTransform = es.msTransform = es.MozTransform = es.OTransform = es.transform = translateStr +  scaleStr ;
                $("#"+currentSlideID).hide();
                removeCurrentPageEvent();
                isLoadComplete = false;
            };
            return translateSlideClass;
        }
    };


    var PageClass = {
        createNew:function(pageJson, pagePath){
            var pageClass = {};
            var pageID   = pageClass.pageID  = pageJson.ID;
            var pageWidth  = pageJson.PageWidth;
            var pageHeight = pageJson.PageHeight;
            var jsonContainers = pageJson.Containers;
            var containers = new Array();
            var pageLoadedFunc;

            var loadIndex  = 0;
            for(var i = 0 ; i < jsonContainers.length ; i ++){
                var containerJson = jsonContainers[i];
                var containerClass = ContainerClass.createNew(containerJson, pagePath);
                containers.push(containerClass);
            }

            pageClass.initView = function(pageLoaded){
                pageLoadedFunc = pageLoaded;
                var pageDiv = '<div id="'+pageID+'"/>';
                $(".slideContainer").append(pageDiv);
                setPageSize();
                loadIndex = 0;
                for(var i=0; i < containers.length; i++){
                    var containerClass = containers[i];
                    if(!containerClass.initView(pageID, containerLoaded)){
                        containers.splice(i,1);
                        i --;
                    }
                }
                if(containers.length == 0){
                    if(pageLoadedFunc != null){
                        pageLoadedFunc();
                    }
                }
            };

            pageClass.resetSize = function(){
                setPageSize();
                for(var i=0; i < containers.length; i++){
                    var containerClass = containers[i];
                    containerClass.resetPosition();
                }
            };

            var setPageSize = function(){
                $("#"+pageID).css({
                    "position":"absolute",
                    "width": pageWidth*fileScale + "px",
                    "height": pageHeight*fileScale + "px",
                    "background-color":"rgba(255,255,255,1)",
                    "perspective":5000,
                    "-webkit-perspective":5000
                });
            };

            var containerLoaded = function(){
                loadIndex ++ ;
                if(loadIndex == containers.length){
                    if(pageLoadedFunc != null){
                        pageLoadedFunc();
                    }
                }
            };
            pageClass.removeView = function(){
                for(var i=0; i < containers.length; i++){
                    var containerClass = containers[i];
                    containerClass.removeView();
                }
                $("#"+pageID).remove();
            };
            pageClass.beginView = function(){
                for(var i=0; i < containers.length; i++){
                    var containerClass = containers[i];
                    containerClass.beginView();
                }
            };
            pageClass.release = function(){
                for(var i=0; i < containers.length; i++){
                    var containerClass = containers[i];
                    containerClass.release();
                }
            };
            return pageClass;
        }
    };

    var ContainerClass = {
        createNew:function(containerJson, pagePath){
            var containerClass = {};
            var containerID          = containerJson.ID;
            var containerX           = containerJson.ContainerX;
            var containerY           = containerJson.ContainerY;
            var containerWidth       = containerJson.ContaienrWidth;
            var containerHeight      = containerJson.ContainerHeight;
            var containerRotation    = containerJson.ContainerRotation;
            var containerAlpha       = containerJson.ContainerAplha;
            var containerComponent   = containerJson.Component;
            var containerAnimations  = containerJson.Animations;
            var containerBehaviors   = containerJson.Behaviors;
            var containerEffects     = containerJson.Effects;

            var containerDivID;
            var containerLoadedFunc;
            var animationClasses;
            var playAnimationIndex = -1;
            var isPlayingAni = false;
            var isPauseAni   = false;

            containerClass.initView = function(pageID, containerLoaded){
                containerDivID = pageID+'_container_'+containerID;
                var component = getComponent(containerComponent);
                var result = false;
                containerLoadedFunc = containerLoaded;
                if(component != null){
                    component.initView(pageID,componentLoaded,componentLoadError);
                    setPosition();
                    result = true;
                }else{
                    result = false;
                }
                return result;
            };

            containerClass.beginView = function(){
                playAniamtions();
            };

            containerClass.release = function(){
                stopAnimations();
                setPosition();
                if(containerAnimations.length > 0){
                    var animationType     = containerAnimations[0].AnimationType;
                    setAnimationFirstStatus(animationType);
                }
            };

            containerClass.removeView = function(){
                var componentView = $("#"+containerDivID);
                if(componentView.length > 0){
                    componentView.remove();
                }
            };

            var componentLoaded = function(){
                setPosition();
                setAnimations();
                if(containerLoadedFunc != null){
                    setTimeout(function(){
                        containerLoadedFunc();
                    }, 20);
                }
            };

            var componentLoadError = function(){
                setPosition();
                if(containerLoadedFunc != null){
                    setTimeout(function(){
                        containerLoadedFunc();
                    }, 20);
                }
            };

            containerClass.resetPosition = function(){
                setPosition();
            };

            var setPosition = function(){
                var componentView = $("#"+containerDivID);
                if(componentView.length > 0){
                    componentView.css({
                        "position":"absolute"
                    });
                    var es = componentView[0].style;
                    es.left = containerX*fileScale + 'px';
                    es.top  = containerY*fileScale + 'px';
                    if(containerWidth >= 0){
                        es.width = containerWidth*fileScale + 'px';
                    } else {
                        es.width = '1px';
                    }
                    if(containerHeight >= 0){
                        es.height = containerHeight*fileScale + 'px';
                    } else {
                        es.height = '1px';
                    }
                    es.opacity  = containerAlpha;
                    var rotationStr = 'rotate('+containerRotation+'deg) ';
                    es.webkitTransform = es.MsTransform = es.msTransform = es.MozTransform = es.OTransform = es.transform = rotationStr;
                }
            };

            var getComponent = function(componentJson){
                var componentType = componentJson.ComponentType;
                var componentData = componentJson.ComponentData;
                switch(componentType){
                    case 'Image':
                        return ImageComponentClass.createNew(componentData, containerDivID, pagePath);
                        break;
                    default :
                        break;
                }
                return null;
            };

            var setAnimations = function(){
                var componentView = $("#"+containerDivID);
                if(componentView.length > 0){
                    var componentObj = componentView[0];
                    animationClasses = new Array();
                    for(var i = 0; i < containerAnimations.length; i++){
                        var animationObj      = containerAnimations[i];
                        var animationType     = animationObj.AnimationType;
                        var animationDelay    = animationObj.AnimationDelay;
                        var animationDuration = animationObj.AnimationDuration;
                        var animationRepeat   = animationObj.AnimationRepeat;
                        var animationIsReverse = false;
                        var animationIsKeep    = true;
                        var animationEaseType = animationObj.AnimationEaseType;
                        var animationClass = AnimationsClass.createNew(animationType,componentObj,animationDelay,animationDuration,animationRepeat,animationIsReverse,animationIsKeep,animationEaseType,animationStart,animationProgress,animationEnd);
                        animationClasses.push(animationClass);
                        if(i == 0){
                            setAnimationFirstStatus(animationType);
                        }
                    }
                }
            };

            var playAniamtions = function(){
                if(animationClasses != null && animationClasses.length > 0){
                    if(!isPauseAni){
                        if(!isPlayingAni){
                            playAnimationIndex = 0;
                            playAnimation();
                        }
                    } else{
                        playAnimation();
                    }
                }
            };

            var stopAnimations = function(){
                if(animationClasses != null && animationClasses.length > 0) {
                    if (playAnimationIndex != -1 && isPlayingAni) {
                        var animationClass = animationClasses[playAnimationIndex];
                        animationClass.stop();
                        isPlayingAni = false;
                        isPauseAni = false;
                        playAnimationIndex = -1;
                    }
                }
            };

            var pauseAnimations = function(){
                if(animationClasses != null && animationClasses.length > 0) {
                    if(playAnimationIndex != -1 && isPlayingAni){
                        var animationClass = animationClasses[playAnimationIndex];
                        animationClass.pause();
                        isPlayingAni = false;
                        isPauseAni   = true;
                    }
                }
            };

            var playAnimation = function(){
                var componentView = $("#"+containerDivID);
                if(componentView.length > 0) {
                    var componentView = $("#" + containerDivID);
                    var animationClass = animationClasses[playAnimationIndex];
                    isPlayingAni = true;
                    isPauseAni   = false;
                    animationClass.play();
                    componentView.show();
                }else{
                    isPlayingAni = false;
                    isPauseAni   = false;
                    playAnimationIndex = -1;
                }
            };

            var animationStart = function(){
            };

            var animationProgress = function(progress){

            };

            var animationEnd = function(){
                playAnimationIndex++;
                if(playAnimationIndex < animationClasses.length){
                    playAnimation();
                }else{
                    isPlayingAni = false;
                    isPauseAni   = false;
                    playAnimationIndex = -1;
                }
            };

            var setAnimationFirstStatus = function(animationType){
                var isFade = false;
                switch (animationType){
                    case "FadeIn":
                        isFade = true;
                        break;
                    case "FadeOut":
                        isFade = false;
                        break;
                    case "FloatIn":
                        isFade = true;
                        break;
                    case "FloatOut":
                        isFade = false;
                        break;
                    case "ZoomIn":
                        isFade = true;
                        break;
                    case "ZoomOut":
                        isFade = false;
                        break;
                    case "ScaleIn":
                        isFade = true;
                        break;
                    case "ScaleOut":
                        isFade = false;
                        break;
                    case "DropIn":
                        isFade = true;
                        break;
                    case "DropOut":
                        isFade = false;
                        break;
                    case "SlideIn":
                        isFade = true;
                        break;
                    case "SlideOut":
                        isFade = false;
                        break;
                    case "RotateIn":
                        isFade = true;
                        break;
                    case "RotateOut":
                        isFade = false;
                        break;
                    case "TeetertotterIn":
                        isFade = true;
                        break;
                    case "TeetertotterOut":
                        isFade = false;
                        break;
                    default :
                        isFade = false;
                }
                if(isFade){
                    $("#"+containerDivID).hide();
                }
            };

            return containerClass;
        }
    };

    var ImageComponentClass = {
        createNew:function(imageJson, containerID, pagePath){
            var imageClass = {};
            var imageID   = containerID;
            var imagePath = pagePath + imageJson.ImagePath;

            imageClass.initView = function(pageID, loaded, loadError){
                var o= new Image();
                o.src = imagePath;
                if(o.complete){
                    showImage(pageID, imagePath);
                    loaded();
                }else{
                    o.onload = function(){
                        showImage(pageID, imagePath);
                        loaded();
                    };
                    o.onerror = function(){
                        showImage(pageID, 'images/error.png');
                        loadError();
                    };
                }
            };

            var showImage = function(pageID, path){
                var imageDiv = '<img id="'+imageID+'" src="'+path+'"/>';
                $("#"+pageID).append(imageDiv);
            };
            return imageClass;
        }
    };

    var AnimationsClass = {
        createNew:function(type,obj,delay,duration,repeat,isReverse,isKeep,easeType,startFunction,progressFunction,endFunction){
            var animationClass = {};
            var curiosAni;
            switch (type){
                case "FadeIn":
                    curiosAni = this.getFadeInAnimation(obj,delay,duration,repeat,isReverse,isKeep,easeType,startFunction,progressFunction,endFunction);
                    break;
                case "FadeOut":
                    curiosAni = this.getFadeOutAnimation(obj,delay,duration,repeat,isReverse,isKeep,easeType,startFunction,progressFunction,endFunction);
                    break;
                case "FloatIn":
                    curiosAni = this.getFloatInAnimation(obj,delay,duration,repeat,isReverse,isKeep,easeType,startFunction,progressFunction,endFunction);
                    break;
                case "FloatOut":
                    curiosAni = this.getFloatOutAnimation(obj,delay,duration,repeat,isReverse,isKeep,easeType,startFunction,progressFunction,endFunction);
                    break;
                case "ZoomIn":
                    curiosAni = this.getZoomInAnimation(obj,delay,duration,repeat,isReverse,isKeep,easeType,startFunction,progressFunction,endFunction);
                    break;
                case "ZoomOut":
                    curiosAni = this.getZoomOutAnimation(obj,delay,duration,repeat,isReverse,isKeep,easeType,startFunction,progressFunction,endFunction);
                    break;
                case "ScaleIn":
                    curiosAni = this.getScaleInAnimation(obj,delay,duration,repeat,isReverse,isKeep,easeType,startFunction,progressFunction,endFunction);
                    break;
                case "ScaleOut":
                    curiosAni = this.getScaleOutAnimation(obj,delay,duration,repeat,isReverse,isKeep,easeType,startFunction,progressFunction,endFunction);
                    break;
                case "DropIn":
                    curiosAni = this.getDropInAnimation(obj,delay,duration,repeat,isReverse,isKeep,easeType,startFunction,progressFunction,endFunction);
                    break;
                case "DropOut":
                    curiosAni = this.getDropOutAnimation(obj,delay,duration,repeat,isReverse,isKeep,easeType,startFunction,progressFunction,endFunction);
                    break;
                case "SlideIn":
                    curiosAni = this.getSlideInAnimation(obj,delay,duration,repeat,isReverse,isKeep,easeType,startFunction,progressFunction,endFunction);
                    break;
                case "SlideOut":
                    curiosAni = this.getSlideOutAnimation(obj,delay,duration,repeat,isReverse,isKeep,easeType,startFunction,progressFunction,endFunction);
                    break;
                case "RotateIn":
                    curiosAni = this.getRotateInAnimation(obj,delay,duration,repeat,isReverse,isKeep,easeType,startFunction,progressFunction,endFunction);
                    break;
                case "RotateOut":
                    curiosAni = this.getRotateOutAnimation(obj,delay,duration,repeat,isReverse,isKeep,easeType,startFunction,progressFunction,endFunction);
                    break;
                case "TeetertotterIn":
                    curiosAni = this.getTeetertotterInAnimation(obj,delay,duration,repeat,isReverse,isKeep,easeType,startFunction,progressFunction,endFunction);
                    break;
                case "TeetertotterOut":
                    curiosAni = this.getTeetertotterOutAnimation(obj,delay,duration,repeat,isReverse,isKeep,easeType,startFunction,progressFunction,endFunction);
                    break;
                default :
                    curiosAni = null;
            }
            animationClass.play = function(){
                if(curiosAni != null){
                    curiosAni.play();
                }
            };
            animationClass.stop = function(){
                if(curiosAni != null){
                    curiosAni.stop();
                }
            };
            animationClass.pause = function(){
                if(curiosAni != null){
                    curiosAni.pause();
                }
            };
            return animationClass;
        },
        getFadeInAnimation:function(obj,delay,duration, repeat, isReverse, isKeep, easeType,startFunction, progressFunction, endFunction){
            var divAnimation = CuriosAnim.createNew( {
                obj: obj,
                delay: delay,
                duration: duration,
                repeat: repeat,
                isReverse: isReverse,
                isKeep: isKeep,
                easeType: "EaseInBack",
                playFromEnd:true,
                endFrames: [{
                    frameAlpha:0
                }],
                frameStart: startFunction,
                frameProgress: progressFunction,
                frameEnd:endFunction
            });
            return divAnimation;
        },
        getFadeOutAnimation:function(obj,delay,duration, repeat, isReverse, isKeep, easeType,startFunction, progressFunction, endFunction){
        var divAnimation = CuriosAnim.createNew( {
                obj: obj,
                delay: delay,
                duration: duration,
                repeat: repeat,
                isReverse: isReverse,
                isKeep: isKeep,
                easeType: "EaseInBack",
                endFrames: [{
                    frameAlpha:0
                }],
                frameStart: startFunction,
                frameProgress: progressFunction,
                frameEnd:endFunction
            });
            return divAnimation;
        },
        getFloatInAnimation:function(obj,delay,duration, repeat, isReverse, isKeep, easeType,startFunction, progressFunction, endFunction){
            var objTop = parseInt(GetCurrentStyle(obj,"top"));
            var objHeight = parseInt(GetCurrentStyle(obj,"height"));
            var divAnimation = CuriosAnim.createNew( {
                obj: obj,
                delay: delay,
                duration: duration,
                repeat: repeat,
                isReverse: isReverse,
                isKeep: isKeep,
                easeType: "empty",
                playFromEnd:true,
                endFrames: [{
                    frameY:objTop+objHeight,
                    frameAlpha:0
                }],
                frameStart: startFunction,
                frameProgress: progressFunction,
                frameEnd:endFunction
            });
            return divAnimation;
        },
        getFloatOutAnimation:function(obj,delay,duration, repeat, isReverse, isKeep, easeType,startFunction, progressFunction, endFunction){
            var objTop = parseInt(GetCurrentStyle(obj,"top"));
            var objHeight = parseInt(GetCurrentStyle(obj,"height"));
            var divAnimation = CuriosAnim.createNew( {
                obj: obj,
                delay: delay,
                duration: duration,
                repeat: repeat,
                isReverse: isReverse,
                isKeep: isKeep,
                easeType: "empty",
                endFrames: [{
                    frameY:objTop+objHeight,
                    frameAlpha:0
                }],
                frameStart: startFunction,
                frameProgress: progressFunction,
                frameEnd:endFunction
            });
            return divAnimation;
        },
        getZoomInAnimation:function(obj,delay,duration, repeat, isReverse, isKeep, easeType,startFunction, progressFunction, endFunction){
            var objTop = parseInt(GetCurrentStyle(obj,"top"));
            var objLeft = parseInt(GetCurrentStyle(obj,"left"));
            var objWidth = parseInt(GetCurrentStyle(obj,"width"));
            var objHeight = parseInt(GetCurrentStyle(obj,"height"));
            var divAnimation = CuriosAnim.createNew( {
                obj: obj,
                delay: delay,
                duration: duration,
                repeat: repeat,
                isReverse: isReverse,
                isKeep: isKeep,
                easeType: "EaseOutBounce",
                playFromEnd:true,
                endFrames: [{
                    frameX:objLeft+objWidth/2 -5,
                    frameY:objTop+objHeight/2 - 5,
                    frameWidth:5,
                    frameHeight:5,
                    frameAlpha:0
                }],
                frameStart: startFunction,
                frameProgress: progressFunction,
                frameEnd:endFunction
            });
            return divAnimation;
        },
        getZoomOutAnimation:function(obj,delay,duration, repeat, isReverse, isKeep, easeType,startFunction, progressFunction, endFunction){
            var objTop = parseInt(GetCurrentStyle(obj,"top"));
            var objLeft = parseInt(GetCurrentStyle(obj,"left"));
            var objWidth = parseInt(GetCurrentStyle(obj,"width"));
            var objHeight = parseInt(GetCurrentStyle(obj,"height"));
            var divAnimation = CuriosAnim.createNew( {
                obj: obj,
                delay: delay,
                duration: duration,
                repeat: repeat,
                isReverse: isReverse,
                isKeep: isKeep,
                easeType: "EaseInBack",
                endFrames: [{
                    frameX:objLeft+objWidth/2 -5,
                    frameY:objTop+objHeight/2 - 5,
                    frameWidth:10,
                    frameHeight:10,
                    frameAlpha:0
                }],
                frameStart: startFunction,
                frameProgress: progressFunction,
                frameEnd:endFunction
            });
            return divAnimation;
        },
        getScaleInAnimation:function(obj,delay,duration, repeat, isReverse, isKeep, easeType,startFunction, progressFunction, endFunction){
            var objTop = parseInt(GetCurrentStyle(obj,"top"));
            var objLeft = parseInt(GetCurrentStyle(obj,"left"));
            var objWidth = parseInt(GetCurrentStyle(obj,"width"));
            var objHeight = parseInt(GetCurrentStyle(obj,"height"));

            var animationWidth  = objWidth*2;
            var animationHeight = objHeight*2;
            var rate;
            if(animationWidth/objWidth > animationHeight/objHeight){
                rate = animationHeight/objHeight;
            }else{
                rate = animationWidth/objWidth;
            }
            animationWidth = rate * objWidth;
            animationHeight = rate * objHeight;
            var animationX = objLeft + objWidth/2 - animationWidth/2;
            var aniamtionY = objTop  + objHeight/2 - animationHeight/2;
            var divAnimation = CuriosAnim.createNew( {
                obj: obj,
                delay: delay,
                duration: duration,
                repeat: repeat,
                isReverse: isReverse,
                isKeep: isKeep,
                easeType: "empty",
                playFromEnd:true,
                endFrames: [{
                    frameX:animationX,
                    frameY:aniamtionY,
                    frameWidth:animationWidth,
                    frameHeight:animationHeight,
                    frameAlpha:0
                }],
                frameStart: startFunction,
                frameProgress: progressFunction,
                frameEnd:endFunction
            });
            return divAnimation;
        },
        getScaleOutAnimation:function(obj,delay,duration, repeat, isReverse, isKeep, easeType,startFunction, progressFunction, endFunction){
            var objTop = parseInt(GetCurrentStyle(obj,"top"));
            var objLeft = parseInt(GetCurrentStyle(obj,"left"));
            var objWidth = parseInt(GetCurrentStyle(obj,"width"));
            var objHeight = parseInt(GetCurrentStyle(obj,"height"));

            var animationWidth  = objWidth*2 ;
            var animationHeight = objHeight*2;
            var rate;
            if(animationWidth/objWidth > animationHeight/objHeight){
                rate = animationHeight/objHeight;
            }else{
                rate = animationWidth/objWidth;
            }
            animationWidth = rate * objWidth;
            animationHeight = rate * objHeight;
            var animationX = objLeft + objWidth/2 - animationWidth/2;
            var aniamtionY = objTop  + objHeight/2 - animationHeight/2;
            var divAnimation = CuriosAnim.createNew( {
                obj: obj,
                delay: delay,
                duration: duration,
                repeat: repeat,
                isReverse: isReverse,
                isKeep: isKeep,
                easeType: "empty",
                endFrames: [{
                    frameX:animationX,
                    frameY:aniamtionY,
                    frameWidth:animationWidth,
                    frameHeight:animationHeight,
                    frameAlpha:0
                }],
                frameStart: startFunction,
                frameProgress: progressFunction,
                frameEnd:endFunction
            });
            return divAnimation;
        },
        getDropInAnimation:function(obj,delay,duration, repeat, isReverse, isKeep, easeType,startFunction, progressFunction, endFunction){
            var objHeight = parseInt(GetCurrentStyle(obj,"height"));
            var divAnimation = CuriosAnim.createNew( {
                obj: obj,
                delay: delay,
                duration: duration,
                repeat: repeat,
                isReverse: isReverse,
                isKeep: isKeep,
                easeType: "EaseOutBounce",
                playFromEnd:true,
                endFrames: [{
                    frameY:0-objHeight*2
                }],
                frameStart: startFunction,
                frameProgress: progressFunction,
                frameEnd:endFunction
            });
            return divAnimation;
        },
        getDropOutAnimation:function(obj,delay,duration, repeat, isReverse, isKeep, easeType,startFunction, progressFunction, endFunction){
            var objHeight = parseInt(GetCurrentStyle(obj,"height"));
            var divAnimation = CuriosAnim.createNew( {
                obj: obj,
                delay: delay,
                duration: duration,
                repeat: repeat,
                isReverse: isReverse,
                isKeep: isKeep,
                easeType: "empty",
                endFrames: [{
                    frameY:pageSlideHeight+objHeight
                }],
                frameStart: startFunction,
                frameProgress: progressFunction,
                frameEnd:endFunction
            });
            return divAnimation;
        },
        getSlideInAnimation:function(obj,delay,duration, repeat, isReverse, isKeep, easeType,startFunction, progressFunction, endFunction){
            var objWidth = parseInt(GetCurrentStyle(obj,"width"));
            var divAnimation = CuriosAnim.createNew( {
                obj: obj,
                delay: delay,
                duration: duration,
                repeat: repeat,
                isReverse: isReverse,
                isKeep: isKeep,
                easeType: "EaseOutBack",
                playFromEnd:true,
                endFrames: [{
                    frameX:0-objWidth*2
                }],
                frameStart: startFunction,
                frameProgress: progressFunction,
                frameEnd:endFunction
            });
            return divAnimation;
        },
        getSlideOutAnimation:function(obj,delay,duration, repeat, isReverse, isKeep, easeType,startFunction, progressFunction, endFunction){
            var objWidth = parseInt(GetCurrentStyle(obj,"width"));
            var divAnimation = CuriosAnim.createNew( {
                obj: obj,
                delay: delay,
                duration: duration,
                repeat: repeat,
                isReverse: isReverse,
                isKeep: isKeep,
                easeType: "EaseInBack",
                endFrames: [{
                    frameX:pageSlideWidth+objWidth
                }],
                frameStart: startFunction,
                frameProgress: progressFunction,
                frameEnd:endFunction
            });
            return divAnimation;
        },
        getRotateInAnimation:function(obj,delay,duration, repeat, isReverse, isKeep, easeType,startFunction, progressFunction, endFunction){
            var rotationYBegin;
            var transformStr    = GetCurrentStyle(obj,"-webkit-transform");
            if(transformStr == "none") {
                rotationYBegin = 0;
            }else{
                var rotationStr;
                var rotationYReg = /(rotateY\([\-\+]?((\d{0,}\.{0,1}\d{0,})(deg))\))/i;
                var rotationYArray = transformStr.match(rotationYReg);
                if(rotationYArray != null){
                    var rotationYStr =rotationYArray[0];
                    rotationYStr=rotationYStr.substring(rotationYStr.indexOf('(')+1,rotationYStr.length-4);
                    rotationYBegin = parseFloat(rotationYStr);
                }else{
                    rotationYBegin = 0;
                }
            }
            var divAnimation = CuriosAnim.createNew( {
                obj: obj,
                delay: delay,
                duration: duration,
                repeat: repeat,
                isReverse: isReverse,
                isKeep: isKeep,
                easeType: "EaseOutBack",
                playFromEnd:true,
                endFrames: [{
                    framePercentage:0.6,
                    frameAlpha:0,
                    frameRotationY:rotationYBegin+360
                },{
                    framePercentage:0.4,
                    frameAlpha:0
                }],
                frameStart: startFunction,
                frameProgress: progressFunction,
                frameEnd:endFunction
            });
            return divAnimation;
        },
        getRotateOutAnimation:function(obj,delay,duration, repeat, isReverse, isKeep, easeType,startFunction, progressFunction, endFunction){
            var rotationYBegin;
            var transformStr    = GetCurrentStyle(obj,"-webkit-transform");
            if(transformStr == "none") {
                rotationYBegin = 0;
            }else{
                var rotationStr;
                var rotationYReg = /(rotateY\([\-\+]?((\d{0,}\.{0,1}\d{0,})(deg))\))/i;
                var rotationYArray = transformStr.match(rotationYReg);
                if(rotationYArray != null){
                    var rotationYStr =rotationYArray[0];
                    rotationYStr=rotationYStr.substring(rotationYStr.indexOf('(')+1,rotationYStr.length-4);
                    rotationYBegin = parseFloat(rotationYStr);
                }else{
                    rotationYBegin = 0;
                }
            }
            var divAnimation = CuriosAnim.createNew( {
                obj: obj,
                delay: delay,
                duration: duration,
                repeat: repeat,
                isReverse: isReverse,
                isKeep: isKeep,
                easeType: "EaseInBack",
                endFrames: [{
                    framePercentage:0.6,
                    frameAlpha:0,
                    frameRotationY:rotationYBegin+360
                },{
                    framePercentage:0.4,
                    frameAlpha:0
                }],
                frameStart: startFunction,
                frameProgress: progressFunction,
                frameEnd:endFunction
            });
            return divAnimation;
        },
        getTeetertotterInAnimation:function(obj,delay,duration, repeat, isReverse, isKeep, easeType,startFunction, progressFunction, endFunction){
            var rotationBegin;
            var transformStr    = GetCurrentStyle(obj,"-webkit-transform");
            if(transformStr == "none") {
                rotationBegin = 0;
            }else{
                var rotationStr;
                var rotationReg = /(rotate\([\-\+]?((\d{0,}\.{0,1}\d{0,})(deg))\))/i;
                var rotationArray = transformStr.match(rotationReg);
                if(rotationArray != null){
                    rotationStr =rotationArray[0];
                    rotationStr=rotationStr.substring(rotationStr.indexOf('(')+1,rotationStr.length-4);
                    rotationBegin = parseFloat(rotationStr);
                }else{
                    rotationReg = /(rotateZ\([\-\+]?((\d{0,}\.{0,1}\d{0,})(deg))\))/i;
                    rotationArray = transformStr.match(rotationReg);
                    if(rotationArray != null){
                        rotationStr =rotationArray[0];
                        rotationStr=rotationStr.substring(rotationStr.indexOf('(')+1,rotationStr.length-4);
                        rotationBegin = parseFloat(rotationStr);
                    }else{
                        rotationBegin = 0;
                    }
                }
            }
            var divAnimation = CuriosAnim.createNew( {
                obj: obj,
                delay: delay,
                duration: duration,
                repeat: repeat,
                isReverse: isReverse,
                isKeep: isKeep,
                easeType: "empty",
                playFromEnd:true,
                endFrames: [{
                    framePercentage:0.6,
                    frameAlpha:0,
                    frameRotation:rotationBegin+720
                },{
                    framePercentage:0.4,
                    frameAlpha:0
                }],
                frameStart: startFunction,
                frameProgress: progressFunction,
                frameEnd:endFunction
            });
            return divAnimation;
        },
        getTeetertotterOutAnimation:function(obj,delay,duration, repeat, isReverse, isKeep, easeType,startFunction, progressFunction, endFunction){
            var rotationBegin;
            var transformStr    = GetCurrentStyle(obj,"-webkit-transform");
            if(transformStr == "none") {
                rotationBegin = 0;
            }else{
                var rotationStr;
                var rotationReg = /(rotate\([\-\+]?((\d{0,}\.{0,1}\d{0,})(deg))\))/i;
                var rotationArray = transformStr.match(rotationReg);
                if(rotationArray != null){
                    rotationStr =rotationArray[0];
                    rotationStr=rotationStr.substring(rotationStr.indexOf('(')+1,rotationStr.length-4);
                    rotationBegin = parseFloat(rotationStr);
                }else{
                    rotationReg = /(rotateZ\([\-\+]?((\d{0,}\.{0,1}\d{0,})(deg))\))/i;
                    rotationArray = transformStr.match(rotationReg);
                    if(rotationArray != null){
                        rotationStr =rotationArray[0];
                        rotationStr=rotationStr.substring(rotationStr.indexOf('(')+1,rotationStr.length-4);
                        rotationBegin = parseFloat(rotationStr);
                    }else{
                        rotationBegin = 0;
                    }
                }
            }
            var divAnimation = CuriosAnim.createNew( {
                obj: obj,
                delay: delay,
                duration: duration,
                repeat: repeat,
                isReverse: isReverse,
                isKeep: isKeep,
                easeType: "empty",
                endFrames: [{
                    framePercentage:0.6,
                    frameAlpha:0,
                    frameRotation:rotationBegin-720
                },{
                    framePercentage:0.4,
                    frameAlpha:0
                }],
                frameStart: startFunction,
                frameProgress: progressFunction,
                frameEnd:endFunction
            });
            return divAnimation;
        }
    };


    window.onload = function(){
        MainFile.init(curiosMainJson);
    };
}());