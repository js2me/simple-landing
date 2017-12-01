/**
 * Created by hps on 08.10.2017.
 */
(function addStylesheetToSuite() {
    // var stylesheet = document.createElement('style');
    // stylesheet.innerHTML = '.simple-landing{width:100%;height:100%;display:block;position:relative;padding:0;-webkit-transform-style:preserve-3d;-moz-transform-style:preserve-3d;-ms-transform-style:preserve-3d;transform-style:preserve-3d}.simple-landing-wrapper{width:100%;height:100%;position:absolute;height:100%!important;height:100%;margin:0 auto;overflow:hidden}.simple-landing__container{width:100%;height:100%;overflow:hidden;position:relative}.simple-landing-viewer{position:absolute;width:100%;height:100%}.simple-landing__scrollbar{width:17px;position:absolute;right:0;height:100%;z-index:1;background:rgba(0,0,0,.05);top:0}.simple-landing__scrollbar-track{width:100%;height:100%;padding:0}.simple-landing__scrollbar-thumb{width:15px;height:20%;top:0;position:absolute;background:red}';
    // document.getElementsByTagName('head')[0].appendChild(stylesheet);
    // stylesheet = null;
})();


window.SimpleLanding = function (options) {
    HTMLElement.prototype.clAdd = function(clName){this.classList.add(clName)};
    HTMLElement.prototype.clRm = function(clName){this.classList.remove(clName)};
    var landingRoot = options.element instanceof HTMLElement && options.element || document.querySelector(options.element);

    function isNum(v) {
        return typeof v === 'number'
    }

    function isBool(v) {
        return typeof v === 'boolean'
    }

    function isStr(v) {
        return typeof v === 'string'
    }

    (function configureOptions() {
        options.scrollBar = options.scrollBar === undefined && true || options.scrollBar;
        options.scrollStep = options.scrollStep || 10;
        options.autoTransition = isBool(options.autoTransition) ? options.autoTransition : true;
        options.scrollTime = isNum(options.scrollTime) ? options.scrollTime : options.autoTransition && 380 || 120;
        options.scrollAnimation = isStr(options.scrollAnimation) ? options.scrollAnimation : 'ease';
        options.anchors = options.anchors || [];
        options.percentNextPageWhenStartLoading = isNum(options.percentNextPageWhenStartLoading) ? options.percentNextPageWhenStartLoading : 80;
        options.percentNextPageWhenStartAutoScrolling = isNum(options.percentNextPageWhenStartAutoScrolling) ? options.percentNextPageWhenStartAutoScrolling : 20;
    })();

    var simpleLandingClass = 'simple-landing',
        simpleLandingChildClass = 'simple-landing__container';

    landingRoot.clAdd(simpleLandingClass);
    landingRoot.parentElement.clAdd('simple-landing-wrapper');
    landingRoot.style.position = 'relative';
    landingRoot.style.transform = 'translate3d(0px, 0%, 0px)';
    landingRoot.style.transition = 'all ' + options.scrollTime + 'ms ' + options.scrollAnimation;
    var scrollbarThumb = document.createElement('div');
    var childs = landingRoot.children;
    var currentScrollValue = 0;
    var maxScroll = (childs.length * 100) - 100;
    var activePage = null;
    var pageIsScrolling = false;
    function setActiveChild(index) {
        if (activePage !== null) {
            childs[activePage].clRm('loaded');
            childs[activePage].clRm('active');
            childs[index].clAdd('loading');
            pageIsScrolling = true;
        }
        currentScrollValue = index * 100;
        if(options.autoTransition || options.autoPositionOnCurrentPage){
            landingRoot.style.transform = 'translate3d(0px, -' + currentScrollValue + '%, 0px)';
            if(options.scrollBar){
                // scrollbarThumb.style.top = ((index/(childs.length-1))*100 - (index ? scrollbarThumb.clientHeight/7.6 : 0))+ '%';
                var pieceOfScrollbar = (scrollbarThumb.clientHeight/scrollBarHeight) * 100;
                if(childs.length>2){
                    scrollbarThumb.style.top = ((index/(childs.length-1))*100 - (index ? index==1 && 13 || pieceOfScrollbar : 0))+ '%';
                }else{
                    scrollbarThumb.style.top = ((index/(childs.length-1))*100 - (index ? pieceOfScrollbar : 0))+ '%';
                }
            }
        }
        childs[index].clAdd('active');
        if(activePage !== null){
            document.body.classList.remove(childs[activePage].getAttribute('data-anchor') + '-is-active');
        }
        activePage = index;
        document.body.classList.add(childs[index].getAttribute('data-anchor') + '-is-active');
        if (activePage !== null) {
            setTimeout(function () {
                childs[index].clRm('loading');
                childs[index].clAdd('loaded');
                pageIsScrolling = false;
            }, options.scrollTime);
        }
    }

    function autoTransition(scrollUp) {
        if (options.autoTransition) {
            setActiveChild(activePage + (scrollUp ? -1 : 1));
        }
        return options.autoTransition;
    }

    function defaultScroll(scrollUp) {
        currentScrollValue += options.scrollStep * (scrollUp && -1 || 1);
        landingRoot.style.transform = 'translate3d(0px, -' + (currentScrollValue < 0 ? 0 : currentScrollValue > maxScroll ? maxScroll : currentScrollValue) + '%, 0px)';
    }

    function checkActivePage(scrollUp){
        for(var x=0;x<childs.length;x++){
                if(x != activePage && ((scrollUp && x == activePage-1) || (!scrollUp && x == activePage+1))){ //todo добавить еще проверку на то между какими индексами находится активПейдж
                    var correctedYPos = x*100,
                        halpPageSub = options.percentNextPageWhenStartLoading,
                        almostCompletePageSub = options.percentNextPageWhenStartAutoScrolling,
                        halfPage=correctedYPos ?
                            scrollUp &&
                                correctedYPos + halpPageSub ||
                                correctedYPos - halpPageSub :
                            correctedYPos + halpPageSub,
                        almostCompletePage=correctedYPos ?
                            scrollUp &&
                                correctedYPos + almostCompletePageSub ||
                                correctedYPos - almostCompletePageSub  :
                            correctedYPos + almostCompletePageSub; //TODO ПЛЮСЫ И МИНУСЫ В УСЛОВИЯ БЛЯТЬ ЕСЛИ ЫСКРОЛЛАП ТО МИНУС ИНАЧЕ ПЛЮС СКАыыыыд
                    if(scrollUp){
                        // var correctedX = x ==
                        if(currentScrollValue < halfPage && activePage-1 >= 0){
                            var child = childs[x];
                            child.clAdd('start-loading');
                            if(currentScrollValue < almostCompletePage){
                                child.clRm('start-loading');
                                setActiveChild(x);
                            }
                        }
                    }else{
                        if(currentScrollValue > halfPage && activePage+1 != childs.length){
                            var child = childs[x];
                            child.clAdd('start-loading');
                            if(currentScrollValue > almostCompletePage){
                                child.clRm('start-loading');
                                setActiveChild(x);
                            }
                        }
                    }
                }
        }
    }

    function mouseWheelOnLandingRoot(e) {
        if (!pageIsScrolling) {
            if (activePage !== null) {
                var scrollUp = e.deltaY < 0, scrollDown = !scrollUp;
                if (scrollUp && (options.autoTransition ? activePage : (currentScrollValue >= 0))) {
                    !autoTransition(scrollUp) && defaultScroll(scrollUp);
                }
                if (scrollDown && (options.autoTransition ? (childs.length > activePage + 1) : (currentScrollValue <= maxScroll))) {
                    !autoTransition(scrollUp) && defaultScroll(scrollUp);
                }
                checkActivePage(scrollUp);
            }
        }
    }
    var scrollBarHeight = 0;
    if (options.scrollBar || options.scrollBar === undefined) {
        landingRoot.clAdd('has-scroll-bar');
        var scrollbar = document.createElement('div');
        var scrollbarTrack = document.createElement('div');
        scrollbar.clAdd('simple-landing__scrollbar');
        scrollbarTrack.clAdd('simple-landing__scrollbar-track');
        scrollbarThumb.clAdd('simple-landing__scrollbar-thumb');
        scrollbarTrack.appendChild(scrollbarThumb);
        scrollbar.appendChild(scrollbarTrack);
        landingRoot.parentElement.appendChild(scrollbar);
        scrollBarHeight = scrollbar.clientHeight;
        scrollbar = null;
        scrollbarTrack = null;
    }

    for (var x = 0; x < childs.length; x++) {
        var elementAnchor = options.anchors[x] || ('page' + x);
        var child = childs[x];
        child.clAdd(simpleLandingChildClass);
        child.clAdd(elementAnchor);
        child.setAttribute('data-anchor',elementAnchor);
        child = null;
    }
    setActiveChild(0);
    var scroll = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        // IE Fallback, you can even fallback to onscroll
        function(callback){ window.setTimeout(callback, 1000/60) };

    function loop(){

        var top = window.pageYOffset;
        console.log('top',top);
        // Where the magic goes
        // ...

        // Recall the loop
        scroll( loop )
    }

// Call the loop for the first time
//     loop();
    document.body.addEventListener('wheel', mouseWheelOnLandingRoot);
};


