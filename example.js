/**
 * Created by hps on 08.10.2017.
 */
//my-landing

var landing = new SimpleLanding({
    element: 'my-landing',
    responsive:true,
    scrollBar:true,
    scrollAnimation:'ease-in-out',
    scrollTime: 1500,
    anchors:[
        'firstPage',
        'secondPage',
        'thirdPage',
        'fourthPage'
    ],
    onLoad:function(){},
    onScroll:function(){}
});