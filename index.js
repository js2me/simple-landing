/**
 * Created by hps on 08.10.2017.
 */


window.SimpleLanding = function (options) {
    (function addStylesheetToSuite() {
        var stylesheet = document.createElement('style');
        stylesheet.innerHTML = 'body,html{margin:0;padding:0;position:relative;width: 100%;height: 100%;}';
        document.getElementsByTagName('head')[0].appendChild(stylesheet);
        stylesheet = null;
    })();
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
    })();

    var simpleLandingClass = 'simple-landing',
        simpleLandingChildClass = 'simple-landing__container';

    landingRoot.clAdd(simpleLandingClass);
    landingRoot.style.position = 'relative';
    landingRoot.style.transform = 'translate3d(0px, 0%, 0px)';
    landingRoot.parentElement.clAdd('simple-landing-wrapper');
    landingRoot.style.transition = 'all ' + options.scrollTime + 'ms ' + options.scrollAnimation;
    var scrollbarThumb = document.createElement('div');
    var childs = landingRoot.children;
    var anchors = options.anchors || [];
    var scrollStep = options.scrollStep;
    var currentScrollValue = 0;
    var maxScroll = (childs.length * 100) - 100;
    var anchorsChilds = {};
    var activePage = null;
    var pageIsScrolling = false;

    function setActiveChild(index) {
        if (activePage !== null) {
            childs[activePage].clRm('loaded');
            childs[activePage].clRm('active');
            childs[index].clAdd('loading');
            pageIsScrolling = true;
        }
        landingRoot.style.transform = 'translate3d(0px, -' + index + '00%, 0px)';
        childs[index].clAdd('active');
        activePage = index;

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
        currentScrollValue += scrollStep * (scrollUp && -1 || 1);
        landingRoot.style.transform = 'translate3d(0px, -' + (currentScrollValue < 0 ? 0 : currentScrollValue > maxScroll ? maxScroll : currentScrollValue) + '%, 0px)';
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
            }
        }
    }

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
        scrollbar = null;
        scrollbarTrack = null;
    }

    for (var x = 0; x < childs.length; x++) {
        var elementAnchor = anchors[x] || ('page' + x);
        var child = childs[x];
        child.clAdd(simpleLandingChildClass);
        child.clAdd(elementAnchor);
        anchorsChilds[elementAnchor] = x;

        child = null;
    }
    setActiveChild(0);

    landingRoot.addEventListener('mousewheel', mouseWheelOnLandingRoot);
};


