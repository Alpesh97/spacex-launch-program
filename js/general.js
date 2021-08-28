/* equal-height */
function equalHeight() {
    $.fn.extend({
        equalHeights: function() {
            var top = 0;
            var row = [];
            var classname = ("equalHeights" + Math.random()).replace(".", "");
            $(this)
            .each(function() {
                var thistop = $(this).offset().top;
                if (thistop > top) {
                    $("." + classname).removeClass(classname);
                    top = thistop;
                }
                $(this).addClass(classname);
                $(this).height("auto");
                var h = Math.max.apply(
                    null,
                    $("." + classname)
                    .map(function() {
                        return $(this).outerHeight();
                    })
                    .get()
                    );
                $("." + classname).outerHeight(h);
            })
            .removeClass(classname);
        }
    });
    $(".spacex-launch-program-wrapper .result-col .result-item-inner .content-block h3").equalHeights();
}

/* ajax-call */
function mission_list(current_year,current_launch,current_land) {
  
    var api_link;

    if(current_year != undefined || current_launch != undefined || current_land != undefined){

        var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname;
        var data_value = {};

        if(current_year == ''){
            current_year = '';
        }
        else{
            data_value['launch_year'] = current_year;
        }

        if(current_land == ''){
            current_land = '';
        }
        else{
            current_land = (current_land.toLowerCase() === 'true');
            data_value['land_success'] = current_land;            
        }


        if(current_launch == ''){
            current_launch = '';
        }
        else{
            current_launch = (current_launch.toLowerCase() === 'true');
            data_value['launch_success'] = current_launch;    
        }

        api_link = "https://api.spaceXdata.com/v3/launches?limit=100&launch_year="+current_year+"&launch_success="+current_launch+"&land_success="+current_land;

        if (Object.keys(data_value).length > 0) {
            var queryString = Object.keys(data_value).map(key => key + '=' + data_value[key]).join('&');   
            newurl = '?limit=100&' + queryString;
        }
        window.history.pushState({path:newurl},'',newurl);
    }
    else{
        api_link = "https://api.spaceXdata.com/v3/launches?limit=100";
    }

    $.ajax({
        type: "GET",
        url: api_link, 
        dataType: "json",
        beforeSend: function(){
            $('body').addClass('overlay');
        },
        complete: function(){
            $('body').removeClass('overlay');
            equalHeight();
        },
        success: function(obj){    

            var list = document.getElementById("mission-list");
            var str = "";

            for (key in obj) {

                if(obj[key].mission_id.length == 0){
                    obj[key].mission_id = '<em>NA</em>'
                }
                if(obj[key].rocket.first_stage.cores[0].land_success == null){
                    obj[key].rocket.first_stage.cores[0].land_success = '<em>NA</em>'
                }

                str += 
                `<div class="result-items">
                     <div class="result-item-inner">
                         <div class="image-block">
                             <img src="${obj[key].links.mission_patch}" alt="${obj[key].mission_name}">
                         </div>
                         <div class="content-block">
                             <h3>${obj[key].mission_name}</h3>
                             <ul class="mission-details-list">
                                 <li>
                                     <span class="title">Mission Ids:</span>
                                     <span class="value">${obj[key].mission_id}</span>
                                 </li>
                                 <li>
                                     <span class="title">Launch Year:</span>
                                     <span class="value">${obj[key].launch_year}</span>
                                 </li>
                                 <li>
                                     <span class="title">Successful Launch:</span>
                                     <span class="value">${obj[key].launch_success}</span>
                                 </li>
                                 <li>
                                     <span class="title">Successful Landing:</span>
                                     <span class="value">${obj[key].rocket.first_stage.cores[0].land_success}</span>
                                 </li>
                             </ul>
                         </div>
                     </div>
                 </div>`;
            }

            list.innerHTML = str;
        }
    });
}

/* Document Ready */
$(document).ready(function() {

    mission_list();
    equalHeight();

    $('.spacex-launch-program-wrapper .filter-col .filter-options ul li span').unbind('click').on('click',function(){

        if($(this).closest('li').hasClass('active')){
            $(this).closest('li').removeClass('active');    
        }
        else{
            $(this).closest('ul').find('li').removeClass('active');
            $(this).closest('li').addClass('active');
        }

        var current_year = $('.filter-year').find('li.active > span').text();
        var current_launch = $('.filter-launch').find('li.active > span').text();
        var current_land = $('.filter-land').find('li.active > span').text();
        mission_list(current_year,current_launch,current_land);
    });

})


/* Window Resize */
$(window).resize(function() {
    equalHeight();
});


/* Window Load */
$(window).on("load",function() {
    equalHeight();
});