/**
 * Created by hps on 08.10.2017.
 */
//my-landing

var landing = new SimpleLanding({
    element: '#my-landing',
    scrollBar:true,
    scrollAnimation:'ease-in-out',
    scrollTime: 100,
    scrollStep: 10,
    anchors:[
        'firstPage',
        'secondPage',
        'thirdPage',
        'fourthPage'
    ],
    autoTransition:false,
    autoPositionOnCurrentPage:false,
    onLoad:function(){},
    onScroll:function(){}
});