$(document).ready(function ($) {

    let model = {
        currentCatIndex: 0,
        adminVisible: false,

        catData: [
            {
                "name": "snoopy",
                "img": "img/catPicture.jpg",
                "clicks": 0,

            },
            {
                "name": "chewie",
                "img": "img/chewie.jpg",
                "clicks": 0,
            },
            {
                "name": "cutie",
                "img": "img/cutie.jpg",
                "clicks": 0,
            },
            {
                "name": "innocent",
                "img": "img/innocent.jpeg",
                "clicks": 0,
            },
            {
                "name": "scarty",
                "img": "img/scarty.jpg",
                "clicks": 0,
            },
            {
                "name": "tiny",
                "img": "img/tiny.jpg",
                "clicks": 0,
            }

        ],


        init: function () {
            this.currentCatIndex = 0;
            this.adminVisible = false;

        },
        updateClickCount: function () {
            this.catData[this.currentCatIndex].clicks++;
        },
        getClickCount: function () {
            return this.catData[this.currentCatIndex].clicks;
        },
        updateCatData: function (catValues) {
            this.catData[this.currentCatIndex].name = catValues.name;
            this.catData[this.currentCatIndex].img = catValues.img;
            this.catData[this.currentCatIndex].clicks = catValues.clicks;

        },
        getCatData: function () {
            return this.catData;
        }


    };


    let controller = {
        init: function () {
            model.init();
            view1.init();
            view2.init();
            adminView.init();

        },

        getCatList: function () {
            let catList = {};
            $.each(model.getCatData(), function (index, cat) {
                catList[index] = cat.name;
            });
            return catList;
        },

        getCurrentCat: function () {
            return model.catData[model.currentCatIndex];
        },

        updateCurrentCat: function (index) {
            model.currentCatIndex = index;
            let currentCat = this.getCurrentCat();
            view2.render(currentCat);
            adminView.render();
        },

        updateClickCount: function () {
            model.updateClickCount();
        },
        getClickCount: function () {
            return model.getClickCount();
        },

        isAdminVisible: function () {
            return model.adminVisible;
        },
        toggleAdminVisible: function () {
            model.adminVisible = (!(model.adminVisible));
        },
        setAdminVisible: function () {
            model.adminVisible = true;
        },
        unsetAdminVisible: function () {
            model.adminVisible = false;
        },
        updateCatData: function (catValues) {
            let validData = this.validate(catValues);
            model.updateCatData(validData);
            let currentCat = this.getCurrentCat();
            view1.updateUrl(model.currentCatIndex, currentCat.name);
            view2.render(currentCat);
            adminView.displayCatInformation(currentCat);
        },
        validate: function (catValues) {
            let currentCat = this.getCurrentCat();
            catValues.name = (catValues.name == '') ? currentCat.name : catValues.name;
            catValues.img = (catValues.img == '') ? currentCat.img : catValues.img;
            catValues.clicks = ($.isNumeric(catValues.clicks)
            && Math.floor(catValues.clicks) == catValues.clicks
            && catValues.clicks >= 0) ? catValues.clicks : currentCat.clicks;

            return catValues;
        }


    };

    let view1 = {
        init: function () {
            let catList = controller.getCatList();
            this.render(catList);

        },
        render: function (catList) {
            let catListHtml = '';
            $.each(catList, function (index, name) {
                catListHtml += '<li class="list-nav">' + '<a href="#" id="' + index + '" class="cat-link" ' + '>' + name + '</a></li>';
            });
            $("#cat-list").html(catListHtml);

        },
        updateUrl: function (catIndex, catName) {
            $("#" + catIndex + "").html(catName);
        }

    };

    let view2 = {
        init: function () {
            let initialCat = controller.getCurrentCat();
            this.render(initialCat);
            $(".cat-link").click(function (ev) {
                ev.preventDefault();
                let catIndex = $(this).attr('id');
                controller.updateCurrentCat(catIndex);
            });
            this.setupImageClick();
        },
        render: function (currentCat) {
            $("#cat-name").html(currentCat.name);
            $("#cat-picture").attr('src', currentCat.img);
            $("#cat-count").html(currentCat.clicks);

        },
        setupImageClick: function () {
            $("#cat-picture").click(function (ev) {
                ev.preventDefault();
                controller.updateClickCount();
                $("#cat-count").html(controller.getClickCount());
                adminView.render();

            });

        }

    };

    let adminView = {
        init: function () {
            this.setupCatAdminButton();
            this.render();
            this.setupSubmit();
            this.setupCancel();
        },
        setupCatAdminButton: function () {
            let self = this;
            $("#admin-btn").click(function (ev) {
                ev.preventDefault();
                controller.setAdminVisible();
                self.render();

            });
        },
        render: function () {
            if (!(controller.isAdminVisible())) {
                $("#cat-admin").hide();
                return;
            }
            $("#cat-admin").show();
            let currentCat = controller.getCurrentCat();
            this.displayCatInformation(currentCat);

        },
        displayCatInformation: function (currentCat) {
            $("#update-name").val(currentCat.name);
            $("#update-image").val(currentCat.img);
            $("#update-clicks").val(currentCat.clicks);
        },
        setupSubmit: function () {
            let self = this;
            $("#cat-submit").click(function (ev) {
                ev.preventDefault();
                let catValues = self.getCatValues();
                controller.updateCatData(catValues);

            });
        },
        setupCancel: function () {
            $("#cat-cancel").click(function (ev) {
                ev.preventDefault();
                $("#cat-admin").hide();
                controller.unsetAdminVisible();
            });

        },
        getCatValues: function () {
            let catValues = {};
            catValues.name = $("#update-name").val();
            catValues.img = $("#update-image").val();
            catValues.clicks = $("#update-clicks").val();
            return catValues;
        },

    };

    controller.init();

});