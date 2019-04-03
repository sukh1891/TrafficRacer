var highscore;
var showscore;
function onLoad() {
    document.addEventListener("deviceready", onDeviceReady, false);
}
function onDeviceReady() {
    var db = openDatabase('trafficracer', '1.0', 'trafficracer', 1024*1024);
    db.transaction(populateDB, failed, success);
    db.transaction(successDB, failed, success);
}
function populateDB(tx) {
    tx.executeSql("CREATE TABLE IF NOT EXISTS highscore (id INTEGER PRIMARY KEY, score INTEGER)");
}
function successDB(tx) {
    tx.executeSql("SELECT * FROM highscore ORDER BY id DESC", [], querySuccess, failed);
}
function querySuccess(tx, results) {
    highscore = results.rows.item(0).score;
    $(".hiscore").html("High Score: " + highscore);
}
function insertoDB(tx) {
    tx.executeSql("INSERT INTO highscore (score) VALUES (?)", [showscore]);
}
function success() {
    
}
function failed() {
    alert("failed");
}
$(function() {
    var anim_id;
    var container = $('#container');
    var car = $('#car');
    var car_1 = $('#car_1');
    var car_2 = $('#car_2');
    var car_3 = $('#car_3');
    var line_1 = $('#line_1');
    var line_2 = $('#line_2');
    var line_3 = $('#line_3');
    var restart_div = $('#restart_div');
    var restart_btn = $('#restart');
    var score = $('#score');
    var container_left = parseInt(container.css('left'));
    var container_width = parseInt(container.width());
    var container_height = parseInt(container.height());
    var car_width = parseInt(car.width());
    var car_height = parseInt(car.height());
    var game_over = true;
    var score_counter = 1;
    var speed = 2;
    var line_speed = 5;
    var move_right = false;
    var move_left = false;
    function left() {
        if (game_over === false && parseInt(car.css('left')) > 0) {
            car.css('left', parseInt(car.css('left')) - 5);
            move_left = requestAnimationFrame(left);
        }
    }
    function right() {
        if (game_over === false && parseInt(car.css('left')) < container_width - car_width) {
            car.css('left', parseInt(car.css('left')) + 5);
            move_right = requestAnimationFrame(right);
        }
    }
    function repeat() {
        if (collision(car, car_1) || collision(car, car_2) || collision(car, car_3)) {
            stop_the_game();
            return;
        }
        score_counter++;
        if (score_counter % 20 == 0) {
            score.text(parseInt(score.text()) + 1);
        }
        if (score_counter % 200 == 0) {
            speed++;
            line_speed++;
        }
        car_down(car_1);
        car_down(car_2);
        car_down(car_3);
        line_down(line_1);
        line_down(line_2);
        line_down(line_3);
        anim_id = requestAnimationFrame(repeat);
    }
    function car_down(car) {
        var car_current_top = parseInt(car.css('top'));
        if (car_current_top > container_height) {
            car_current_top = -200;
            var car_left = parseInt(Math.random() * (container_width - car_width));
            car.css('left', car_left);
        }
        car.css('top', car_current_top + speed);
    }
    function line_down(line) {
        var line_current_top = parseInt(line.css('top'));
        if (line_current_top > container_height) {
            line_current_top = -300;
        }
        line.css('top', line_current_top + line_speed);
    }
    restart_btn.click(function() {
        location.reload();
    });
    function stop_the_game() {
        game_over = true;
        cancelAnimationFrame(anim_id);
        cancelAnimationFrame(move_right);
        cancelAnimationFrame(move_left);
        $(".over_div").fadeIn(10);
        showscore = parseInt(score_counter/20);
        $(".urscore").html("Your Score: " + showscore);
        if(showscore > highscore) {
            $(".newscore").fadeIn(10);
            db = openDatabase('highscore', '1.0', 'highscore', 1024*1024);
            db.transaction(insertoDB, failed, success);
        }
    }
    function collision($div1, $div2) {
        var x1 = $div1.offset().left;
        var y1 = $div1.offset().top;
        var h1 = $div1.outerHeight(true);
        var w1 = $div1.outerWidth(true);
        var b1 = y1 + h1;
        var r1 = x1 + w1;
        var x2 = $div2.offset().left;
        var y2 = $div2.offset().top;
        var h2 = $div2.outerHeight(true);
        var w2 = $div2.outerWidth(true);
        var b2 = y2 + h2;
        var r2 = x2 + w2;
        if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;
        return true;
    }
    $(".start").click(function() {
        anim_id = requestAnimationFrame(repeat);
        game_over = false;
        $(".start_div").fadeOut(10);
        $(".left").addClass("opacity");
        $(".right").addClass("opacity");
    });
    $(".ppbutton").click(function() {
        if(game_over == false) {
            game = cancelAnimationFrame(anim_id);
            game_over = true;
            $(".pause_div").fadeIn(10);
        }
    });
    $(".continue").click(function() {
        anim_id = requestAnimationFrame(repeat);
        game_over = false;
        $(".pause_div").fadeOut(10);
    });
    $(".restart").click(function() {
        location.reload();
    });
    $(".left").on('touchstart', function() {
        move_left = requestAnimationFrame(left);
    });
    $(".left").on('touchend', function() {
        cancelAnimationFrame(move_left);
    });
    $(".right").on('touchstart', function() {
        move_right = requestAnimationFrame(right);
    });
    $(".right").on('touchend', function() {
        cancelAnimationFrame(move_right);
    });
});