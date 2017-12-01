/**
 * Created by hps on 08.10.2017.
 */
//my-landing

var landing = new SimpleLanding({
    element: '#my-landing',
    scrollBar:true,
    scrollAnimation:'ease-in',
    scrollTime: 340,
    scrollStep: 20,
    anchors:[
        'mainPage',
        'heroesPage',
        'streamsPage'
    ],
    autoTransition:true,
    autoPositionOnCurrentPage:true,
    onLoad:function(){
        console.log('on load SimpleLanding');
    },
    onScroll:function(){}
});