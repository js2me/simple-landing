/**
 * Created by hps on 08.10.2017.
 */


window.SimpleLanding = function(options){
    (function addStylesheetToSuite(){
        var stylesheet = document.createElement('style');
        stylesheet.innerHTML = 'body,html{margin:0;padding:0;position:relative;width: 100%;height: 100%;}';
        document.getElementsByTagName('head')[0].appendChild(stylesheet);
        stylesheet = null;
    })();
    var landingRoot = options.element instanceof HTMLElement && options.element || document.getElementById(options.element);


    var simpleLandingClass = 'simple-landing',
        simpleLandingChildClass = 'simple-landing__container';
    // var landingWrapper = document.createElement('div');
    // landingWrapper.classList.add('landing-wrapper');
    // landingRoot.parentElement.appendChild(landingWrapper);
    // landingWrapper.appendChild(landingRoot);
    landingRoot.classList.add(simpleLandingClass);
    landingRoot.style.position = 'relative';
    landingRoot.style.transform = 'translate3d(0px, 0%, 0px)';
    landingRoot.parentElement.classList.add('simple-landing-wrapper');
    landingRoot.style.transition = 'all ' + options.scrollTime + 'ms ' + options.scrollAnimation;
    /*
     position: relative;
     transform: translate3d(0px, 0%, 0px);
     transition: all 1000ms ease;
     */
    var scrollbarThumb = document.createElement('div');
    if(options.scrollBar || options.scrollBar === undefined){
        landingRoot.classList.add('has-scroll-bar');
        var scrollbar = document.createElement('div');
        var scrollbarTrack = document.createElement('div');

        scrollbar.classList.add('simple-landing__scrollbar');
        scrollbarTrack.classList.add('simple-landing__scrollbar-track');
        scrollbarThumb.classList.add('simple-landing__scrollbar-thumb');
        scrollbarTrack.appendChild(scrollbarThumb);
        scrollbar.appendChild(scrollbarTrack);
        landingRoot.parentElement.appendChild(scrollbar);
        scrollbar = null;
        scrollbarTrack = null;
    }
    var childs = landingRoot.children;
    var anchors = options.anchors || [];

    var anchorsChilds = {};
    var activePage = null;
    var pageIsScrolling = false;
    function setActiveChild(index){
            if(activePage !== null){
                childs[activePage].classList.remove('loaded');
                childs[activePage].classList.remove('active');
                childs[index].classList.add('loading');
                pageIsScrolling = true;
            }
            landingRoot.style.transform =  'translate3d(0px, -'+index+'00%, 0px)';
            childs[index].classList.add('active');
            activePage = index;

            if(activePage !== null) {
                setTimeout(function () {
                    childs[index].classList.remove('loading');
                    childs[index].classList.add('loaded');
                    pageIsScrolling = false;
                }, options.scrollTime);
            }
    }
    for(var x=0;x<childs.length;x++){
        var elementAnchor = anchors[x] || ('page'+x);
        var child = childs[x];
        child.classList.add(simpleLandingChildClass);
        child.classList.add(elementAnchor);
        anchorsChilds[elementAnchor] = x;

        child = null;
    }
    setActiveChild(0);
    landingRoot.addEventListener('mousewheel',function(e){
        if(!pageIsScrolling){
            var newActivePage = null;
            if(activePage !== null){
                if(activePage){
                    if (e.deltaY < 0) {
                        newActivePage = activePage - 1;
                        setActiveChild(newActivePage);
                        console.log('scrolling up');
                    }
                }
                if (e.deltaY > 0) {
                    if(childs.length > activePage+1){
                        newActivePage = activePage + 1;
                        setActiveChild(newActivePage);
                        console.log('scrolling down');
                    }
                }
            }
        }
    });
    //
    // landingRoot.addEventListener('mousewheel',function(e){

    // });
    // childs = null;

    // var animation = {
    //     // no easing, no acceleration
    //     ['linear']: function (t) { return t },
    //     // accelerating from zero velocity
    //     ['ease-in-quad']: function (t) { return t*t },
    //     // decelerating to zero velocity
    //     ['ease-out-quad']: function (t) { return t*(2-t) },
    //     // acceleration until halfway, then deceleration
    //     ['ease-in-out-quad']: function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
    //     // accelerating from zero velocity
    //     ['ease-in-cubic']: function (t) { return t*t*t },
    //     // decelerating to zero velocity
    //     ['ease-out-cubic']: function (t) { return (--t)*t*t+1 },
    //     // acceleration until halfway, then deceleration
    //     ['ease-in-out-cubic']: function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },
    //     // accelerating from zero velocity
    //     ['ease-in-quart']: function (t) { return t*t*t*t },
    //     // decelerating to zero velocity
    //     ['ease-out-quart']: function (t) { return 1-(--t)*t*t*t },
    //     // acceleration until halfway, then deceleration
    //     ['ease-in-out-quart']: function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t },
    //     // accelerating from zero velocity
    //     ['ease-in-quint']: function (t) { return t*t*t*t*t },
    //     // decelerating to zero velocity
    //     ['ease-out-quint']: function (t) { return 1+(--t)*t*t*t*t },
    //     // acceleration until halfway, then deceleration
    //     ['ease-in-out-quint']: function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t }
    // }[options.scrollAnimation || 'linear'],
        // animationTime = options.scrollTime || 350;


    // (function findRequestAnimationFrame(){
    //     window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.webkitRequestAnimationFrame;
    // })();

    // function doScrolling(element, duration) {
    //     var startingY = window.pageYOffset;
    //     var elementY = window.pageYOffset + element.getBoundingClientRect().top;
    //     // If element is close to page's bottom then window will scroll only to some position above the element.
    //     var targetY = document.body.scrollHeight - elementY < window.innerHeight ? document.body.scrollHeight - window.innerHeight : elementY
    //     var diff = targetY - startingY;
    //     // Easing function: easeInOutCubic
    //     // From: https://gist.github.com/gre/1650294
    //     // var easing = function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 }
    //     var start;
    //
    //     if (!diff) return;
    //
    //     // Bootstrap our animation - it will get called right before next frame shall be rendered.
    //     window.requestAnimationFrame(function step(timestamp) {
    //         if (!start) start = timestamp;
    //         var time = timestamp - start;
    //         window.scrollTo(0, startingY + diff * animation(Math.min(time / duration, 1)));
    //         if (time < duration) {
    //             window.requestAnimationFrame(step)
    //         }
    //     })
    // }
// Or simply:
//doScrolling('#mytarget', 1000)


    // doScrolling(childs[3],animationTime);

    //
    // if(options.responsive){
    //     this.onResizeCallback = function(){
    //         var newHeight = document.body.clientHeight + 'px';
    //         var childs = landingRoot.children;
    //         for(var x=0;x<childs.length;x++){
    //             childs[x].style.height = newHeight;
    //         }
    //         childs = null;
    //     };
    //     window.addEventListener("resize", this.onResizeCallback.bind(this));
    // }
};


