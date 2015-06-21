/**
* Created by Allen on 2015/4/29.
*/
window.requestAnimFrame = (function() {
    return  window.requestAnimationFrame        ||
        window.webkitRequestAnimationFrame          ||
        window.mozRequestAnimationFrame             ||
        window.oRequestAnimationFrame               ||
        window.msRequestAnimationFrame              ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

var Engine = {

    FRAME_RATE: 60,

    createNew:function(a){

        var engine = {};
        var obj       = a.obj;
        var delay     = a.delay;
        var duration  = a.duration;
        var repeat    = a.repeat;
        var isReverse = a.isReverse;
        var isKeep    = a.isKeep;
        var easeType  = a.easeType;
        //engine.keyFrames  = a.keyFrames;
        var keyFrames;
        var reverseFrames;

        var isPlaying   = false;
        var isPaused    = false;
        var isStop      = false;
        var isReversPlaying = false;
        var frames     = 0;
        var progress   = 0;
        var delayFrames = 0;
        var holdFrame;
        var playTimes;

        var isPlayFrame = false;
        var isLoadFrame = false;
        var easeFunction;

        engine.play = function(){
            if(!isPaused) {
                if(!isPlaying){
                    if(!isStop){
                        keyFrames = a.getKeyFrames();
                    }
                    frames      = 0;
                    progress    = 0;
                    delayFrames = delay/1000 * Engine.FRAME_RATE;
                    holdFrame = keyFrames[0];
                    setObjFrame(holdFrame);
                    playTimes = repeat;
                    isPlaying   = true;
                    isPaused    = false;
                    isStop      = false;
                    isReversPlaying = false;
                    easeFunction = AnimationEaseType.getFunction(easeType);
                    setReverseKeyFrames();
                    a.frameStart();
                    onFrame();
                    loadFrame();
                }
            }else{
                isStop      = false;
                isPaused    = false;
                isPlaying   = true;
                onFrame();
            }
        };

        engine.pause = function(){
            isPaused    = true;
            isPlaying   = false;
            isStop      = false;
            isPlayFrame = false;
        };

        engine.stop = function(){
            isPaused    = false;
            isPlaying   = false;
            isStop      = true;
            isPlayFrame = false;
            setObjFrame(holdFrame);
        };

        var loadFrame = function () {
            if(!isLoadFrame){
                animFrame();
            }
            isLoadFrame = true;
        };

        var animFrame = function(){
            requestAnimFrame(animFrame);
            if(isPlayFrame){
                onFrame();
            }
        };

        var setReverseKeyFrames = function(){
            reverseFrames = new Array();
            for(var i = keyFrames.length; i >0; i--) {
                reverseFrames.push(keyFrames[i-1]);
            }
        };

        var onFrame = function(){
            isPlayFrame = false;
            progress    = (frames - delayFrames - 1) / (duration / 1000*Engine.FRAME_RATE);
            if(progress < 0) {
                frames ++;
                a.frameProgress(0);
                isPlayFrame = true;
                return
            }
            var kfs;
            if(isReversPlaying) {
                kfs  = reverseFrames;
            }else {
                kfs  = keyFrames;
            }
            var keyFrameIndex    = parseInt(kfs.length * progress);
            var km;
            var easeValue;
            if(easeFunction != null) {
                easeValue = easeFunction(duration*progress,0,1,duration);
                keyFrameIndex = parseInt(kfs.length * easeValue);
                var k1;
                var k2;
                var kt;
                var leftRate;
                var topRate;
                var widthRate;
                var heightRate;
                var alphaRate;
                var perspectiveRate;
                var rotationRate;
                var rotationXRate;
                var rotationYRate;
                var scaleXRate;
                var scaleYRate;
                var scaleZRate;
                var translateXRate;
                var translateYRate;
                var translateZRate;
                if(keyFrameIndex > kfs.length-1 || keyFrameIndex< 0){
                    kt = a.getKeyFrameByIndex(keyFrameIndex, isReversPlaying);
                    if(kt == null){
                        if(keyFrameIndex< 0){
                            k1 = kfs[0];
                            k2 = kfs[0-keyFrameIndex];
                        }else if(keyFrameIndex > kfs.length-1){
                            var maxKeyFrame = keyFrameIndex - (kfs.length-1);
                            k1 = kfs[kfs.length - 1];
                            k2 = kfs[kfs.length - maxKeyFrame];
                        }
                        leftRate        = k1.frameX - k2.frameX;
                        topRate         = k1.frameY - k2.frameY;
                        widthRate       = k1.frameWidth - k2.frameWidth;
                        heightRate      = k1.frameHeight - k2.frameHeight;
                        alphaRate       = k1.frameAlpha - k2.frameAlpha;
                        perspectiveRate = k1.framePerspective - k2.framePerspective;
                        rotationRate    = k1.frameRotation - k2.frameRotation;
                        rotationXRate   = k1.frameRotationX - k2.frameRotationX;
                        rotationYRate   = k1.frameRotationY - k2.frameRotationY;
                        scaleXRate      = k1.frameScaleX - k2.frameScaleX;
                        scaleYRate      = k1.frameScaleY - k2.frameScaleY;
                        scaleZRate      = k1.frameScaleZ - k2.frameScaleZ;
                        translateXRate  = k1.frameTranslateX - k2.frameTranslateY;
                        translateYRate  = k1.frameTranslateY - k2.frameTranslateY;
                        translateZRate  = k1.frameTranslateZ - k2.frameTranslateZ;

                        kt = {frameX:k1.frameX+leftRate,
                            frameY:k1.frameY+topRate,
                            frameWidth:k1.frameWidth+widthRate,
                            frameHeight:k1.frameHeight+heightRate,
                            frameAlpha:k1.frameAlpha+alphaRate,
                            framePerspective:k1.framePerspective+perspectiveRate,
                            frameRotation:k1.frameRotation+rotationRate,
                            frameRotationX:k1.frameRotationX +rotationXRate,
                            frameRotationY:k1.frameRotationY +rotationYRate,
                            frameScaleX: k1.frameScaleX+scaleXRate,
                            frameScaleY:k1.frameScaleY+scaleYRate,
                            frameScaleZ:k1.frameScaleZ+scaleZRate,
                            frameTranslateX:k1.frameTranslateX+translateXRate,
                            frameTranslateY:k1.frameTranslateY+translateYRate,
                            frameTranslateZ:k1.frameTranslateZ+translateZRate
                        };
                        km = kt;
                    }else {
                        km = kt;
                    }
                } else{
                    km = kfs[keyFrameIndex];
                }
            }else{
                if(keyFrameIndex > kfs.length-1) {
                    keyFrameIndex = kfs.length-1;
                }else if(keyFrameIndex< 0) {
                    keyFrameIndex = 0;
                }
                km = kfs[keyFrameIndex];
            }
            setObjFrame(km);
            frames++;
            if(progress >= 1) {
                if((isReverse ) && (!isReversPlaying)) {
                    isPlaying = true;
                    isReversPlaying  = true;
                    frames = 0;
                } else {
                    if(isReversPlaying) {
                        setObjFrame(holdFrame);
                        frames = 0;
                        isPlaying       = false;
                        isReversPlaying = false;
                        a.frameEnd();
                        return;
                    }else {
                        if(repeat != 0){
                            if(!isKeep){
                                setObjFrame(holdFrame);
                            }
                            playTimes --;
                            if(playTimes == 0) {
                                frames = 0;
                                isPlaying       = false;
                                isReversPlaying = false;
                                a.frameEnd();
                                return
                            }else{
                                frames = 0;
                                isReversPlaying = false;
                            }
                        }else{
                            frames = 0;
                            isReversPlaying = false;
                        }
                    }
                }
            } else {
                if(!isReverse) {
                    a.frameProgress(progress);
                }else{
                    if(!isReversPlaying){
                        a.frameProgress(progress/2);
                    }else{
                        a.frameProgress(0.5+progress/2);
                    }
                }
            }
            if(isPlaying){
                isPlayFrame = true;
            }
        };

        var setObjFrame = function(frame){
            var es = obj.style;
            es.left = frame.frameX + 'px';
            es.top  = frame.frameY + 'px';
            if(frame.frameWidth >= 0){
                es.width = frame.frameWidth + 'px';
            } else {
                es.width = '1px';
            }
            if(frame.frameHeight >= 0){
                es.height = frame.frameHeight + 'px';
            } else {
                es.height = '1px';
            }
            es.opacity  = frame.frameAlpha;

            es.webkitPerspective = es.msPerspective = es.mozPerspective = es.perspective = frame.framePerspective;
            var rotationStr = 'rotate('+frame.frameRotation+'deg) ';
            var rotationXStr    = 'rotateX('+frame.frameRotationX+'deg) ';
            var rotationYStr    = 'rotateY('+frame.frameRotationY+'deg) ';
            var scaleStr        = 'scale3d('+frame.frameScaleX+', '+frame.frameScaleY+', '+frame.frameScaleZ+ ') ';
            var translateStr = 'translate3d('+frame.frameTranslateX+'px, '+frame.frameTranslateY+'px, '+ frame.frameTranslateZ+'px) ';
            var transformStr = translateStr + rotationStr + rotationXStr + rotationYStr  + scaleStr;
            es.webkitTransform = es.MsTransform = es.msTransform = es.MozTransform = es.OTransform = es.transform = transformStr;

            //console.log("x = "+frame.frameX+"y = "+frame.frameY+"w = "+frame.frameWidth+"h = "+frame.frameHeight+"a = "+frame.frameAlpha+"transform = "+transformStr)
        };
        return engine;
    }
};

var CuriosAnim = {
    createNew : function(b){
        var animation = {};
        var animationObj = b;
        var engineFrame = Object.create(EngineFrame);
        engineFrame.obj      = animationObj.obj;
        engineFrame.delay     = animationObj.delay===undefined?0:animationObj.delay;
        engineFrame.duration  = animationObj.duration===undefined?5000:animationObj.duration;
        engineFrame.repeat    = animationObj.repeat===undefined?1:animationObj.repeat;
        engineFrame.isReverse = animationObj.isReverse===undefined?false:animationObj.isReverse;
        engineFrame.isKeep    = animationObj.isKeep===undefined?true:animationObj.isKeep;
        engineFrame.easeType  = animationObj.easeType===undefined?'empty':animationObj.easeType;
        engineFrame.frameStart    = animationObj.frameStart===undefined?function(){}:animationObj.frameStart;
        engineFrame.frameProgress = animationObj.frameProgress===undefined?function(progress){}:animationObj.frameProgress;
        engineFrame.frameEnd      = animationObj.frameEnd===undefined?function(){}:animationObj.frameEnd;
        engineFrame.getKeyFrameByIndex = function(keyFramIndex, isReversPlay){
            return null;
        };
        engineFrame.getKeyFrames = function(){
            var playFromEnd           = animationObj.playFromEnd===undefined?false:animationObj.playFromEnd;
            var leftFrom = GetCurrentStyle(animationObj.obj, "left")==='auto'?0:parseFloat(GetCurrentStyle(animationObj.obj, "left"));
            var topFrom  = GetCurrentStyle(animationObj.obj, "top")==='auto'?0:parseFloat(GetCurrentStyle(animationObj.obj, "top"));
            var widthFrom = parseFloat(GetCurrentStyle(animationObj.obj, "width"));
            var heightFrom = parseFloat(GetCurrentStyle(animationObj.obj, "height"));
            var alphaFrom = parseFloat(GetCurrentStyle(animationObj.obj, "opacity"));
            var perspectiveFrom = GetCurrentStyle(animationObj.obj, "-webkit-perspective")==='none'?0:parseFloat(GetCurrentStyle(animationObj.obj, "-webkit-perspective"));
            var transformStr    = GetCurrentStyle(animationObj.obj,"-webkit-transform");
            var rotationFrom;
            var rotationXFrom;
            var rotationYFrom;
            var scaleXFrom;
            var scaleYFrom;
            var scaleZFrom;
            var translateXFrom;
            var translateYFrom;
            var translateZFrom;
            if(transformStr == "none") {
                rotationFrom = 0;
                rotationXFrom = 0;
                rotationYFrom = 0;
                scaleXFrom = 1;
                scaleYFrom = 1;
                scaleZFrom = 1;
                translateXFrom = 0;
                translateYFrom = 0;
                translateZFrom = 0;
            } else {
                var transReg = /(matrix\()/i;
                if(transformStr.match(transReg) != null) {
                    rotationFrom = 0;
                    rotationXFrom = 0;
                    rotationYFrom = 0;
                    scaleXFrom = 1;
                    scaleYFrom = 1;
                    scaleZFrom = 1;
                    translateXFrom = 0;
                    translateYFrom = 0;
                    translateZFrom = 0;
                }else{
                    var rotationReg = /(rotate\([\-\+]?((\d{0,}\.{0,1}\d{0,})(deg))\))/i;
                    var rotationArray = transformStr.match(rotationReg);
                    var rotationStr = '';
                    if(rotationArray != null){
                        rotationStr =rotationArray[0];
                        rotationStr=rotationStr.substring(rotationStr.indexOf('(')+1,rotationStr.length-4);
                        rotationFrom = parseFloat(rotationStr);
                    }else{
                        rotationReg = /(rotateZ\([\-\+]?((\d{0,}\.{0,1}\d{0,})(deg))\))/i;
                        rotationArray = transformStr.match(rotationReg);
                        if(rotationArray != null){
                            rotationStr =rotationArray[0];
                            rotationStr=rotationStr.substring(rotationStr.indexOf('(')+1,rotationStr.length-4);
                            rotationFrom = parseFloat(rotationStr);
                        }else{
                            rotationFrom = 0;
                        }
                    }

                    var rotationXReg = /(rotateX\([\-\+]?((\d{0,}\.{0,1}\d{0,})(deg))\))/i;
                    var rotationXArray = transformStr.match(rotationXReg);
                    if(rotationXArray != null){
                        var rotationXStr =rotationXArray[0];
                        rotationXStr=rotationXStr.substring(rotationXStr.indexOf('(')+1,rotationXStr.length-4);
                        rotationXFrom = parseFloat(rotationXStr);
                    }else{
                        rotationXFrom = 0;
                    }

                    var rotationYReg = /(rotateY\([\-\+]?((\d{0,}\.{0,1}\d{0,})(deg))\))/i;
                    var rotationYArray = transformStr.match(rotationYReg);
                    if(rotationYArray != null){
                        var rotationYStr =rotationYArray[0];
                        rotationYStr=rotationYStr.substring(rotationYStr.indexOf('(')+1,rotationYStr.length-4);
                        rotationYFrom = parseFloat(rotationYStr);
                    }else{
                        rotationYFrom = 0;
                    }

                    var scaleReg = /(scale3d\([\-\+]?(\d{0,}\.{0,1}\d{0,}), [\-\+]?(\d{0,}\.{0,1}\d{0,}), [\-\+]?(\d{0,}\.{0,1}\d{0,})\))/i;
                    var scaleArray = transformStr.match(scaleReg);
                    var scaleStr = '';
                    if(scaleArray != null){
                        scaleStr = scaleArray[0];
                        scaleStr = scaleStr.substring(scaleStr.indexOf('(')+1,scaleStr.length-1);
                        scaleArray = scaleStr.split(", ");
                        scaleXFrom = parseFloat(scaleArray[0]);
                        scaleYFrom = parseFloat(scaleArray[1]);
                        scaleZFrom = parseFloat(scaleArray[2]);
                    }else{
                        scaleReg = /(scale\([\-\+]?(\d{0,}\.{0,1}\d{0,}), [\-\+]?(\d{0,}\.{0,1}\d{0,})\))/i;
                        scaleArray = transformStr.match(scaleReg);
                        if(scaleArray != null){
                            scaleStr = scaleArray[0];
                            scaleStr = scaleStr.substring(scaleStr.indexOf('(')+1,scaleStr.length-1);
                            scaleArray = scaleStr.split(", ");
                            scaleXFrom = parseFloat(scaleArray[0]);
                            scaleYFrom = parseFloat(scaleArray[1]);
                            scaleZFrom = 1;
                        }else{
                            scaleReg = /(scale\([\-\+]?(\d{0,}\.{0,1}\d{0,})\))/i;
                            scaleArray = transformStr.match(scaleReg);
                            if(scaleArray != null){
                                scaleStr = scaleArray[0];
                                scaleStr = scaleStr.substring(scaleStr.indexOf('(')+1,scaleStr.length-1);
                                scaleXFrom = parseFloat(scaleStr);
                                scaleYFrom = parseFloat(scaleStr);
                                scaleZFrom = 1;
                            }else{
                                scaleXFrom = 1;
                                scaleYFrom = 1;
                                scaleZFrom = 1;
                            }
                        }
                    }

                    var translateReg = /(translate3d\([\-\+]?((\d{0,}\.{0,1}\d{0,})(px)), [\-\+]?((\d{0,}\.{0,1}\d{0,})(px)), [\-\+]?((\d{0,}\.{0,1}\d{0,})(px))\))/i;
                    var translateArray = transformStr.match(translateReg);
                    var translateStr = '';
                    if(translateArray != null){
                        translateStr = translateArray[0];
                        translateStr = translateStr.substring(translateStr.indexOf('(')+1,translateStr.length-1);
                        translateArray = translateStr.split(", ");
                        translateXFrom = parseFloat(translateArray[0]);
                        translateYFrom = parseFloat(translateArray[1]);
                        translateZFrom = parseFloat(translateArray[2]);
                    }else{
                        translateReg = /(translate\([\-\+]?((\d{0,}\.{0,1}\d{0,})(px)), [\-\+]?((\d{0,}\.{0,1}\d{0,})(px))\))/i;
                        translateArray = transformStr.match(translateReg);
                        if(translateArray != null){
                            translateStr = translateArray[0];
                            translateStr = translateStr.substring(translateStr.indexOf('(')+1,translateStr.length-1);
                            translateArray = translateStr.split(", ");
                            translateXFrom = parseFloat(translateArray[0]);
                            translateYFrom = parseFloat(translateArray[1]);
                            translateZFrom = 0;
                        }else{
                            translateXFrom = 0;
                            translateYFrom = 0;
                            translateZFrom = 0;
                        }
                    }
                }

            }
            var keyFrames = new Array();
            keyFrames.push({
                frameX:leftFrom,
                frameY:topFrom,
                frameWidth:widthFrom,
                frameHeight:heightFrom,
                frameAlpha:alphaFrom,
                framePerspective:perspectiveFrom,
                frameRotation:rotationFrom,
                frameRotationX:rotationXFrom,
                frameRotationY:rotationYFrom,
                frameScaleX:scaleXFrom,
                frameScaleY:scaleYFrom,
                frameScaleZ:scaleZFrom,
                frameTranslateX:translateXFrom,
                frameTranslateY:translateYFrom,
                frameTranslateZ:translateZFrom
            });
            var endFrames  = animationObj.endFrames;
            var framesDuration = animationObj.duration;
            var leavePercentage = 1;
            var keyFrameLeftFrom        = leftFrom;
            var keyFrameTopFrom         = topFrom;
            var keyFramewidthFrom       = widthFrom;
            var keyFrameHeightFrom      = heightFrom;
            var keyFrameAlphaFrom       = alphaFrom;
            var keyFramePerspectiveFrom = perspectiveFrom;
            var keyFrameRotationFrom    = rotationFrom;
            var keyFrameRotationXFrom   = rotationXFrom;
            var keyFrameRotationYFrom   = rotationYFrom;
            var keyFrameScaleXFrom      = scaleXFrom;
            var keyFrameScaleYFrom      = scaleYFrom;
            var keyFrameScaleZFrom      = scaleZFrom;
            var keyFrameTranslateXFrom  = translateXFrom;
            var keyFrameTranslateYFrom  = translateYFrom;
            var keyFrameTranslateZFrom  = translateZFrom;
            for(var i = 0; i < endFrames.length ; i ++)
            {
                var endFrame = endFrames[i];
                var frameDurationProgress = endFrame.framePercentage===undefined?leavePercentage:endFrame.framePercentage;
                if(i == endFrames.length - 1) {
                    frameDurationProgress = leavePercentage;
                    leavePercentage = 0;
                }else{
                    leavePercentage = leavePercentage - frameDurationProgress;
                }

                var frameDuration = framesDuration * frameDurationProgress;
                var leftTo    = endFrame.frameX===undefined?keyFrameLeftFrom:endFrame.frameX;
                var topTo     = endFrame.frameY===undefined?keyFrameTopFrom:endFrame.frameY;
                var widthTo    = endFrame.frameWidth===undefined?keyFramewidthFrom:endFrame.frameWidth;
                var heightTo   = endFrame.frameHeight===undefined?keyFrameHeightFrom:endFrame.frameHeight;
                var alphaTo    = endFrame.frameAlpha===undefined?keyFrameAlphaFrom:endFrame.frameAlpha;
                var perspectiveTo = endFrame.framePerspective===undefined?keyFramePerspectiveFrom:endFrame.framePerspective;
                var rotationTo    = endFrame.frameRotation===undefined?keyFrameRotationFrom:endFrame.frameRotation;
                var rotationXTo   = endFrame.frameRotationX===undefined?keyFrameRotationXFrom:endFrame.frameRotationX;
                var rotationYTo   = endFrame.frameRotationY===undefined?keyFrameRotationYFrom:endFrame.frameRotationY;
                var scaleXTo   = endFrame.frameScaleX===undefined?keyFrameScaleXFrom:endFrame.frameScaleX;
                var scaleYTo   = endFrame.frameScaleY===undefined?keyFrameScaleYFrom:endFrame.frameScaleY;
                var scaleZTo   = endFrame.frameScaleZ===undefined?keyFrameScaleZFrom:endFrame.frameScaleZ;
                var translateXTo   = endFrame.frameTranslateX===undefined?keyFrameTranslateXFrom:endFrame.frameTranslateX;
                var translateYTo   = endFrame.frameTranslateY===undefined?keyFrameTranslateYFrom:endFrame.frameTranslateY;
                var translateZTo   = endFrame.frameTranslateZ===undefined?keyFrameTranslateZFrom:endFrame.frameTranslateZ;

                var frames = frameDuration / 1000*Engine.FRAME_RATE;
                var leftRate    = ( leftTo - keyFrameLeftFrom ) / frames;
                var topRate    = ( topTo - keyFrameTopFrom ) / frames;
                var widthRate    = ( widthTo - keyFramewidthFrom ) / frames;
                var heightRate    = ( heightTo - keyFrameHeightFrom ) / frames;
                var alphaRate    = ( alphaTo - keyFrameAlphaFrom ) / frames;
                var perspectiveRate    = (perspectiveTo - keyFramePerspectiveFrom) / frames;
                var rotationRate    = ( rotationTo - keyFrameRotationFrom ) / frames;
                var rotationXRate    = ( rotationXTo - keyFrameRotationXFrom ) / frames;
                var rotationYRate    = ( rotationYTo - keyFrameRotationYFrom ) / frames;
                var scaleXRate    = ( scaleXTo - keyFrameScaleXFrom ) / frames;
                var scaleYRate    = ( scaleYTo - keyFrameScaleYFrom ) / frames;
                var scaleZRate    = ( scaleZTo - keyFrameScaleZFrom ) / frames;
                var translateXRate    = ( translateXTo - keyFrameTranslateXFrom ) / frames;
                var translateYRate    = ( translateYTo - keyFrameTranslateYFrom ) / frames;
                var translateZRate    = ( translateZTo - keyFrameTranslateZFrom ) / frames;
                var keyFrame = 0;
                while(keyFrame < frames) {
                    if(keyFrame < frames - 1){
                        keyFrames.push({
                            frameX:keyFrameLeftFrom+=leftRate,
                            frameY:keyFrameTopFrom+=topRate,
                            frameWidth:keyFramewidthFrom+=widthRate,
                            frameHeight:keyFrameHeightFrom+=heightRate,
                            frameAlpha:keyFrameAlphaFrom+=alphaRate,
                            framePerspective:keyFramePerspectiveFrom+=perspectiveRate,
                            frameRotation:keyFrameRotationFrom+=rotationRate,
                            frameRotationX:keyFrameRotationXFrom+=rotationXRate,
                            frameRotationY:keyFrameRotationYFrom+=rotationYRate,
                            frameScaleX:keyFrameScaleXFrom+=scaleXRate,
                            frameScaleY:keyFrameScaleYFrom+=scaleYRate,
                            frameScaleZ:keyFrameScaleZFrom+=scaleZRate,
                            frameTranslateX:keyFrameTranslateXFrom+=translateXRate,
                            frameTranslateY:keyFrameTranslateYFrom+=translateYRate,
                            frameTranslateZ:keyFrameTranslateZFrom+=translateZRate
                        });
                    }else{
                        keyFrames.push({
                            frameX:leftTo,
                            frameY:topTo,
                            frameWidth:widthTo,
                            frameHeight:heightTo,
                            frameAlpha:alphaTo,
                            framePerspective:perspectiveTo,
                            frameRotation:rotationTo,
                            frameRotationX:rotationXTo,
                            frameRotationY:rotationYTo,
                            frameScaleX:scaleXTo,
                            frameScaleY:scaleYTo,
                            frameScaleZ:scaleZTo,
                            frameTranslateX:translateXTo,
                            frameTranslateY:translateYTo,
                            frameTranslateZ:translateZTo
                        });
                    }
                    keyFrame++;
                }
            }
            if(!playFromEnd){
                return keyFrames;
            }else{
                var endKeyFrames = new Array();
                for(var i= keyFrames.length; i > 0; i--){
                    endKeyFrames.push(keyFrames[i-1]);
                }
                return endKeyFrames;
            }
        };

        var engine = Engine.createNew(engineFrame);

        animation.play = function(){
            engine.play();
        };

        animation.pause = function(){
            engine.pause();
        };

        animation.stop = function(){
            engine.stop();
        };

        return animation;
    }
};

var AnimationEaseType = {
    getFunction:function(easeType){
        switch(easeType){
            case "EaseInQuad":
                return this.animationFunctionEaseInQuad;
            case "EaseOutQuad":
                return this.animationFunctionEaseOutQuad;
            case "EaseInOutQuad":
                return this.animationFunctionEaseInOutQuad;
            case "EaseInCubic":
                return this.animationFunctionEaseInCubic;
            case "EaseOutCubic":
                return this.animationFunctionEaseOutCubic;
            case "EaseInOutCubic":
                return this.animationFunctionEaseInOutCubic;
            case "EaseInQuart":
                return this.animationFunctionEaseInQuart;
            case "EaseOutQuart":
                return this.animationFunctionEaseOutQuart;
            case "EaseInOutQuart":
                return this.animationFunctionEaseInOutQuart;
            case "EaseInQuint":
                return this.animationFunctionEaseInQuint;
            case "EaseOutQuint":
                return this.animationFunctionEaseOutQuint;
            case "EaseInOutQuint":
                return this.animationFunctionEaseInOutQuint;
            case "EaseInSine":
                return this.animationFunctionEaseInSine;
            case "EaseOutSine":
                return this.animationFunctionEaseOutSine;
            case "EaseInOutSine":
                return this.animationFunctionEaseInOutSine;
            case "EaseInExpo":
                return this.animationFunctionEaseInExpo;
            case "EaseOutExpo":
                return this.animationFunctionEaseOutExpo;
            case "EaseInOutExpo":
                return this.animationFunctionEaseInOutExpo;
            case "EaseInCirc":
                return this.animationFunctionEaseInCirc;
            case "EaseOutCirc":
                return this.animationFunctionEaseOutCirc;
            case "EaseInOutCirc":
                return this.animationFunctionEaseInOutCirc;
            case "EaseInElastic":
                return this.animationFunctionEaseInElastic;
            case "EaseOutElastic":
                return this.animationFunctionEaseOutElastic;
            case "EaseInOutElastic":
                return this.animationFunctionEaseInOutElastic;
            case "EaseInBack":
                return this.animationFunctionEaseInBack;
            case "EaseOutBack":
                return this.animationFunctionEaseOutBack;
            case "EaseInOutBack":
                return this.animationFunctionEaseInOutBack;
            case "EaseInBounce":
                return this.animationFunctionEaseInBounce;
            case "EaseOutBounce":
                return this.animationFunctionEaseOutBounce;
            case "EaseInOutBounce":
                return this.animationFunctionEaseInOutBounce;
            default :
                return null;
        }
    },

    animationFunctionEaseInQuad:function(t,b,c,d){
        return c*(t/=d)*t + b;
    },

    animationFunctionEaseOutQuad:function(t,b,c,d){
        return -c *(t/=d)*(t-2) + b;
    },

    animationFunctionEaseInOutQuad:function(t,b,c,d){
        if ((t/=d/2) < 1) return c/2*t*t + b;
        return -c/2 * ((--t)*(t-2) - 1) + b;
    },

    animationFunctionEaseInCubic:function(t,b,c,d){
        return c*(t/=d)*t*t + b;
    },

    animationFunctionEaseOutCubic:function(t,b,c,d){
        return c*((t=t/d-1)*t*t + 1) + b;
    },

    animationFunctionEaseInOutCubic:function(t,b,c,d){
        if ((t/=d/2) < 1) return c/2*t*t*t + b;
        return c/2*((t-=2)*t*t + 2) + b;
    },

    animationFunctionEaseInQuart:function(t,b,c,d){
        return c*(t/=d)*t*t*t + b;
    },

    animationFunctionEaseOutQuart:function(t,b,c,d){
        return -c * ((t=t/d-1)*t*t*t - 1) + b;
    },

    animationFunctionEaseInOutQuart:function(t,b,c,d){
        if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
        return -c/2 * ((t-=2)*t*t*t - 2) + b;
    },

    animationFunctionEaseInQuint:function(t,b,c,d){
        return c*(t/=d)*t*t*t*t + b;
    },

    animationFunctionEaseOutQuint:function(t,b,c,d){
        return c*((t=t/d-1)*t*t*t*t + 1) + b;
    },

    animationFunctionEaseInOutQuint:function(t,b,c,d){
        if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
        return c/2*((t-=2)*t*t*t*t + 2) + b;
    },

    animationFunctionEaseInSine:function(t,b,c,d){
        return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
    },

    animationFunctionEaseOutSine:function(t,b,c,d){
        return c *Math.sin(t/d * (Math.PI/2)) + b;
    },

    animationFunctionEaseInOutSine:function(t,b,c,d){
        return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
    },

    animationFunctionEaseInExpo:function(t,b,c,d){
        return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
    },

    animationFunctionEaseOutExpo:function(t,b,c,d){
        return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
    },

    animationFunctionEaseInOutExpo:function(t,b,c,d){
        if (t==0) return b;
        if (t==d) return b+c;
        if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
        return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
    },

    animationFunctionEaseInCirc:function(t,b,c,d){
        return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
    },

    animationFunctionEaseOutCirc:function(t,b,c,d){
        return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
    },

    animationFunctionEaseInOutCirc:function(t,b,c,d){
        if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
        return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
    },

    animationFunctionEaseInElastic:function(t,b,c,d){
        var s = 1.70158; var p=0; var a=c;
        if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
        if (a < Math.abs(c)) { a=c; s=p/4; }
        else s = p/(2*Math.PI) * Math.asin (c/a);
        return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
    },

    animationFunctionEaseOutElastic:function(t,b,c,d){
        var s = 1.70158;
        var p = 0;
        var a =c;
        if (t==0) return b;
        if ((t/=d)==1) return b+c;
        if (!p) p=d*.3;
        if (a < Math.abs(c)) {
            a=c;
            s=p/4;
        } else {

            s = p/(2*Math.PI) * Math.asin( c/a);
        }
        return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
    },

    animationFunctionEaseInOutElastic:function(t,b,c,d){
        var s=1.70158;
        var p=0;
        var a=c;
        if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
        if (a < Math.abs(c)) { a=c; s=p/4; }
        else s = p/(2*Math.PI) * Math.asin(c/a);
        if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1))) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + b;
        return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
    },

    animationFunctionEaseInBack:function(t,b,c,d){
        var s = 1.70158;
        return c*(t/=d)*t*((s+1)*t - s) + b;
    },

    animationFunctionEaseOutBack:function(t,b,c,d){
        var s = 1.70158;
        return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
    },

    animationFunctionEaseInOutBack:function(t,b,c,d){
        var s = 1.70158;
        if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
        return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
    },

    animationFunctionEaseInBounce:function(t,b,c,d){
        return c - AnimationEaseType.animationFunctionEaseOutBounce(d-t, 0, c, d) + b;
    },

    animationFunctionEaseOutBounce:function(t,b,c,d){
        if ((t/=d) < (1/2.75)) {
            return c*(7.5625*t*t) + b;
        } else if (t < (2/2.75)) {
            return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
        } else if (t < (2.5/2.75)) {
            return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
        } else {
            return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
        }
    },

    animationFunctionEaseInOutBounce:function(t,b,c,d){
        if (t < d/2)
            return AnimationEaseType.animationFunctionEaseInBounce (t*2, 0, c, d) * .5 + b;
        else
            return AnimationEaseType.animationFunctionEaseOutBounce(t*2-d, 0, c, d) * .5 + c*.5 + b;
    }
};

var EngineFrame = {
    obj:'',
    delay:0,
    duration:1000,
    repeat:1,
    isReverse:false,
    isKeep:false,
    easeType:'empty',
    keyFrames: [{
        frameX:1,
        frameY:1,
        frameWidth:200,
        frameHeight:200,
        frameAlpha:0.2,
        framePerspective:0,
        frameRotation:30,
        frameRotationX:0,
        frameRotationY:0,
        frameScaleX:1,
        frameScaleY:1,
        frameScaleZ:1,
        frameTranslateX:0,
        frameTranslateY:0,
        frameTranslateZ:1
    }],
    frameStart: function(){
    },
    frameProgress: function (progress) {
    },
    frameEnd:function() {
    },
    getKeyFrameByIndex:function(keyFramIndex, isReversPlay){

    },
    getKeyFrames:function(){

    }
};

var animationFrame = {
    obj:'',
    delay:0,
    duration:1000,
    repeat:1,
    isReverse:false,
    isKeep:false,
    easeType:'empty',
    playFromEnd:false,
    endFrames: [{
        framePercentage:1,
        frameX:1,
        frameY:1,
        frameWidth:200,
        frameHeight:200,
        frameAlpha:0.2,
        framePerspective:0,
        frameRotation:400,
        frameRotationX:0,
        frameRotationY:0,
        frameScaleX:1,
        frameScaleY:1,
        frameScaleZ:1,
        frameTranslateX:0,
        frameTranslateY:0,
        frameTranslateZ:1
    }],
    frameStart: function(){
    },
    frameProgress: function (progress) {
    },
    frameEnd:function(){
    }
};

function GetCurrentStyle (obj, prop) {
    if(obj.style[prop] != "") {
        return obj.style[prop];
    } else if (obj.currentStyle) {
        return obj.currentStyle[prop];
    } else if (window.getComputedStyle) {
        propprop = prop.replace (/([A-Z])/g, "-$1");
        propprop = prop.toLowerCase ();
        return document.defaultView.getComputedStyle (obj,null)[prop];
    }
    return null;
}
