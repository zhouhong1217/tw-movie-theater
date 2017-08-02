'use strict';
$(document).ready(function () {
    $("#movieGenre").click(function () {
        $("#nav").css("display", "block");
        $("#moveMovieGenre").css("display", "block");
        $("#movieGenre").css("display", "none");
    });
    $("#moveMovieGenre").click(function () {
        $("#nav").css("display", "none");
        $("#movieGenre").css("display", "block");
        $("#moveMovieGenre").css("display", "none");
    });
    /*分类操作*/
    $("#nav ul li").click(function () {
        $(this).find(".hover").slideToggle("slow"); //find查找元素对象
        //alert(1);
        if ($(this).hasClass("curr")) {
            $(this).removeClass("curr");
        }
        else {
            $(this).addClass("curr");//当前点击的li本身
        }
        $(this).siblings().removeClass("curr").find(".hover").slideUp("slow");//同辈元素  兄弟元素
    });
    $.ajax({
        url: 'http:127.0.0.1:8081/movies/all',
        type: 'GET',
        crossDomain: true,
        cache: false,
        success: function (data, status) {
            for (let value of data) {
                let html = `<li class="col-xs-4 col-sm-2 col-md-2" id="${value.id}" style="height:280px;text-align: center">
<a id="movieInfo" href="movieDetails.html?id=${value.id}">
<img src="${value.image}" style="width: 150px;height: 200px" alt="${value.alt}">
<h4 style="margin-bottom: 2px;text-align: center">${value.title}</h4><sup>${value.original_title}</sup>
</a>
</li>`;
                let showList = document.getElementById('movieAllInfo');
                showList.innerHTML += html;
            }
        }
    });
    $(document).on('click', '#movieInfo', function (e) {
        let movieId = $(e.target()).attr();
    });
    $("#nav ul li .hover p a").click(function (e) {  //事件event
        e.preventDefault();
        let movieGenreId = $(e.target).attr('now');
        // console.log(typeof movieGenreId)
        $.ajax({
            url: `http:127.0.0.1:8081/movies/searchByGenreid?genreid=${movieGenreId}`,
            type: 'GET',
            crossDomain: true,
            cache: false,
            success: function (data, status) {
                var showGenreList = '';
                for (let value of data) {
                    let html = `<li class="col-xs-4 col-sm-2 col-md-2" id="${value.id}" style="height:280px;text-align: center">
<a id="movieInfo" href="movieDetails.html?id=${value.id}">
<img src="${value.image}" style="width: 150px;height: 200px" alt="${value.alt}">
<h4 style="margin-bottom: 2px;text-align: center">${value.title}</h4><sup>${value.original_title}</sup>
</a>
</li>`;
                    showGenreList += html;
                    $('#movieAllInfo').html(showGenreList);
                }
            }
        })
    })
});
