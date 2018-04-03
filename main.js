$(document).ready(function () {


    gitPanel = {
        $this: this,
        options: {
            body: $('#body'),
            api: {
                url: 'api.php',
                method: 'post'
            },
        },

        init: function (parameters) {
            gitPanel.options = Object.assign(gitPanel.options, {});

            if (parameters) {
                gitPanel.options = Object.assign(gitPanel.options, parameters);
            }
        },

        renderPage: function (parameters) {
            html = '';

            if (parameters.title) {
                html += '<h1 class="title">' + parameters.title + '</h1>';
            }

            if (parameters.html) {
                html += '<div class="page">' + parameters.html + '</div>';
            }

            if (parameters.interface) {
                html += gitPanel.renderInterface(parameters.interface);
            }

            gitPanel.options.content.html(html)
            gitPanel.options = Object.assign(gitPanel.options, {interface: $('#interface')});
        },

        renderPopap: function (form) {
            html = '<div id="popap" class="popap-background">' +

                '<div class="popap">' +
                '<div class="popap-content">' +
                '<p class="title">' + form.title + '</p>' +
                '<p class="popap-desriptions">' + form.description + '</p>' +
                form.body +
                '</div>' +
                '</div>' +
                '</div>';
            $('body').append(html);
            gitPanel.callbackPopap();
        },

        callbackPopap: function () {
            $('#popap').on('click', function () {
                $(this).remove()
            }).children().on('click', function (e) {
                e.stopPropagation()
            })
        },

        renderInterface: function (interface, subInterface) {
            if (!subInterface) {
                html = '<div id="interface" class="interface">';
            } else {
                html = '';
            }

            interface.forEach(function (value, index) {
                switch (value.type) {
                    case 'button':
                        html += '<button ';

                        if (value.method) {
                            html += 'data-method="' + value.method + '"';
                        }

                        if (value.data_type) {
                            html += 'data-type="' + value.data_type + '"';
                        }

                        if (value.id) {
                            html += 'id="' + value.id + '"';
                        }

                        if (value.class) {
                            html += 'class="' + value.class + '"';
                        }

                        if (value.style) {
                            html += 'style="' + value.style + '"';
                        }

                        if (value.placeholder) {
                            html += 'palceholder="' + value.placeholder + '"';
                        }

                        if (value.name) {
                            html += 'name="' + value.name + '"';
                        }
                        html += '>';

                        if (value.name) {
                            html += value.name;
                        }

                        html += '</button>';
                        break;
                    case 'textarea':
                        html += '<textarea ';

                        if (value.data_type) {
                            html += 'data-type="' + value.data_type + '"';
                        }

                        if (value.id) {
                            html += 'id="' + value.id + '"';
                        }

                        if (value.class) {
                            html += 'class="' + value.class + '"';
                        }

                        if (value.style) {
                            html += 'style="' + value.style + '"';
                        }

                        if (value.placeholder) {
                            html += 'palceholder="' + value.placeholder + '"';
                        }

                        if (value.name) {
                            html += 'name="' + value.name + '"';
                        }
                        html += '>';

                        html += '</textarea>';
                        break;
                    case 'text':
                        html += '<input type="text" ';

                        if (value.data_type) {
                            html += 'data-type="' + value.data_type + '"';
                        }

                        if (value.id) {
                            html += 'id="' + value.id + '"';
                        }

                        if (value.class) {
                            html += 'class="' + value.class + '"';
                        }

                        if (value.style) {
                            html += 'style="' + value.style + '"';
                        }

                        if (value.placeholder) {
                            html += 'palceholder="' + value.placeholder + '"';
                        }

                        if (value.name) {
                            html += 'name="' + value.name + '"';
                        }

                        html += ' />';
                        break;
                    case 'block':
                        html += '<div ';


                        if (value.method) {
                            html += 'data-method="' + value.method + '"';
                        }

                        if (value.data_type) {
                            html += 'data-type="' + value.data_type + '"';
                        }

                        if (value.id) {
                            html += 'id="' + value.id + '"';
                        }

                        if (value.class) {
                            html += 'class="' + value.class + '"';
                        }

                        if (value.style) {
                            html += 'style="' + value.style + '"';
                        }

                        if (value.placeholder) {
                            html += 'palceholder="' + value.placeholder + '"';
                        }

                        if (value.name) {
                            html += 'name="' + value.name + '"';
                        }

                        html += '>';

                        if (value.subInterface) {
                            html += gitPanel.renderInterface(value.subInterface, true);
                        }

                        html += '</div>';
                        break;
                }
            })

            if (!subInterface) {
                html += '</div>';
            }

            return html;
        },

        renderStatus: function () {
            data = gitPanel.getData({type: 'status'})
            if (data.result) {
                html = '<div id="result" class="result">';
                $(data.data).each(function (i, val) {
                    if (val.match(/\(use "/)) {
                        if (val.match(/git reset HEAD/)) {
                            flag = 'reset';
                        }
                        if (val.match(/git rm --cached/)) {
                            flag = 'rm';
                        } else if (val.match(/git add <file>..." to update/)) {
                            flag = 'add, checkout';
                        } else if (val.match(/git checkout/)) {
                            flag = 'add, checkout';
                        } else if (val.match(/git add <file>..." to include/)) {
                            flag = 'add';
                        }
                    }

                    regex = /([#\t+](([^\s].+):\s+(.+)))|([#\t+]([^\s+].+))/g;
                    var m;

                    if ((m = regex.exec(val)) !== null) {
                        if (m[5] == undefined) {
                            html += ('<label class="statusRow ' + m[3].replace(' ', '_') + '"><input type="checkbox" data-type="' + flag + '" value="' + m[4] + '">' + m[3] + ' : ' + m[4] + '</label>');
                        } else if (m[1] == undefined) {
                            html += ('<label class="statusRow not_type"><input type="checkbox" data-type="' + flag + '" value="' + m[6] + '">' + m[6] + '</label>');
                        }
                    } else {
                        html += ('<p>' + val + '</p>');
                    }
                });
                html += '</div>';
            } else {
                html = data.message;
            }
            return html;
        },

        callbackStatus: function () {
            gitPanel.options.interface.on('click', gitPanel.options.status.buttonsID, function () {
                var data = {};
                gitPanel.options.status.result.find('input[data-type*="' + $(this).data('type') + '"]:checked').each(function (i, val) {
                    data[i] = $(val).val();
                });
                console.log(data);
                if (Object.keys(data).length != 0) {
                    data = {
                        type: $(this).data('method'),
                        data: data
                    };

                    responce = gitPanel.getData(data)

                    if (responce.result) {
                        gitPanel.updateStatus();
                    } else {
                        alert('Error: reload page; ' + responce.message);
                    }
                }
            })
        },

        updateStatus: function () {
            html = gitPanel.renderStatus();
            gitPanel.options.status.result.replaceWith(html);
            gitPanel.options.status.result = $('#result');
        },

        renderCommit: function () {
            return html = '<div id="result"></div>';
        },

        callbackCommit: function () {
            console.log(gitPanel.options.commit.button);

            gitPanel.options.commit.button.on('click', function () {
                data = {
                    type: $(this).data('method'),
                    data: {
                        message: gitPanel.options.commit.textarea.val()
                    }
                };

                responce = gitPanel.getData(data);

                if (responce.result) {

                    html = '';

                    responce.data.forEach(function (value) {
                        html += '<p>' + value + '</p>'
                    });

                    gitPanel.options.commit.result.html(html)

                } else {
                    alert(responce.message)
                }
            })
        },

        renderBranch: function () {
            data = gitPanel.getData({type: 'branch'});
            if (data.result) {
                html = '<div id="branch" class="result">';
                $(data.data).each(function (i, val) {
                    type = val.replace('*', '');
                    if (type != val) {
                        html += '<div class="' + gitPanel.options.branch.resultListClass + ' branch-item active" data-type="' + $.trim(type) + '">* ' + $.trim(type) + '<div class="' + gitPanel.options.branch.optionsClass + ' branch-item-options"></div></div>';
                    } else {
                        html += '<div class="' + gitPanel.options.branch.resultListClass + ' branch-item" data-type="' + $.trim(type) + '">' + $.trim(type) + '<div class="' + gitPanel.options.branch.optionsClass + ' branch-item-options"></div></div>';
                    }
                });
                html += '</div>';
            } else {
                html = data.message
            }
            return html;
        },

        callbackBranch: function () {

            gitPanel.options.branch.button.on('click', function () {
                if (text = gitPanel.options.branch.text.val()) {
                    data = {
                        type: $(this).data('method'),
                        data: {
                            name: text
                        }
                    };
                    responce = gitPanel.getData(data);

                    gitPanel.options.branch.options.hide();

                    if (responce.result) {
                        gitPanel.updateBranch()
                        gitPanel.options.branch.result.find('.' + gitPanel.options.branch.resultListClass).removeClass('open');
                        gitPanel.options.branch.options.hide();
                    } else {
                        alert('Error: branch not created; ' + responce.message)
                    }
                }
            });

            gitPanel.options.branch.options.on('click', gitPanel.options.branch.optionsButtonsID, function () {
                data = {
                    type: $(this).data('method'),
                    data: {
                        name: $('.' + gitPanel.options.branch.resultListClass + '.open').data('type')
                    }
                }
                gitPanel.options.branch.options.hide();
                responce = gitPanel.getData(data);

                if (responce.result) {
                    gitPanel.updateBranch()
                    gitPanel.options.branch.result.find('.' + gitPanel.options.branch.resultListClass).removeClass('open');
                } else {
                    if (responce.data.callback) {
                        eval(responce.data.callback)
                    } else {
                        alert('Error: not use event for branch; ' + responce.message)
                    }
                }

            });

            gitPanel.options.body.on('click', gitPanel.options.branch.resultID, function (e) {
                    target = $(e.target);

                    var div = gitPanel.options.branch.result.find('.' + gitPanel.options.branch.resultListClass);

                    if (div.is(e.target) || div.has(e.target).length !== 0) {

                        if (target.hasClass('open') || target.parents('.' + gitPanel.options.branch.resultListClass).hasClass('open')) {

                            if (div.is(e.target)) {
                                target.removeClass('open');
                            } else {
                                target.parents('.' + gitPanel.options.branch.resultListClass).removeClass('open');
                            }

                            gitPanel.options.branch.options.hide();

                        } else {

                            if (div.is(e.target)) {
                                options = target.find('.' + gitPanel.options.branch.optionsClass)
                            } else {
                                options = target
                            }

                            positionX = options.offset();

                            position = {
                                top: positionX.top + options.innerWidth(),
                                right: positionX.left + options.outerWidth()
                            };

                            gitPanel.options.branch.options.css({top: position.top, right: (window.innerWidth - position.right)});

                            gitPanel.options.branch.result.find('.' + gitPanel.options.branch.resultListClass).removeClass('open');

                            if (div.is(e.target)) {
                                target.addClass('open');
                            } else {
                                target.parents('.' + gitPanel.options.branch.resultListClass).addClass('open');
                            }

                            if (target.hasClass('active') || target.parents('.' + gitPanel.options.branch.resultListClass).hasClass('active')) {
                                gitPanel.options.branch.options.addClass('branch-active');
                            } else {
                                gitPanel.options.branch.options.removeClass('branch-active');
                            }

                            gitPanel.options.branch.options.show();
                        }
                    }
                }
            );

            gitPanel.options.body.on('dblclick', gitPanel.options.branch.resultID, function (e) {
                console.log(e.target)
                if ($(e.target).hasClass(gitPanel.options.branch.resultListClass)) {

                }
            });


            $(document).mouseup(function (e) {
                var div = gitPanel.options.branch.result.find('.' + gitPanel.options.branch.resultListClass);
                var div2 = gitPanel.options.branch.options;
                if (!div.is(e.target)
                    && div.has(e.target).length === 0 && !div2.is(e.target)
                    && div2.has(e.target).length === 0) {
                    gitPanel.options.branch.result.find('.' + gitPanel.options.branch.resultListClass).removeClass('open');
                    gitPanel.options.branch.options.hide();
                }
            });


        },

        updateBranch: function () {
            html = gitPanel.renderBranch();
            gitPanel.options.branch.result.replaceWith(html);
            gitPanel.options.branch.result = $('#branch');
        },

        renderPopapGitRemote: function () {
            form = {
                'title': 'Added u git repository',
                'description': '',
                'body': '<form id="gitRepo">' +
                '<p >Use mask <label for="gitPassword">(*password*)</label> for inplement password in repository <label for="gitRepo">href</label></p>' +
                '<div class="input-group">' +
                '<input id="gitHref" type="text" name="href" class="form-control" placeholder="git repository href" aria-describedby="basic-addon1" autocomplete="off">' +
                '</div>' +
                '<div class="input-group">' +
                '<input id="gitPassword" type="password" name="password" class="form-control" placeholder="git repository password" aria-describedby="basic-addon1" autocomplete="off">' +
                '</div>' +
                '<button id="popapSubmit" type="button" class="btn btn-primary">Update config</button>' +
                '</form>'
                ,
            }
            gitPanel.renderPopap(form);
            gitPanel.options.popap = {
                'form': $('#gitRepo'),
                'submit': $('#popapSubmit'),
                'href': $('#gitHref'),
                'password': $('#gitPassword'),
            }

            gitPanel.callbackPopapGitRemote();
        },

        callbackPopapGitRemote: function () {
            gitPanel.options.popap.submit.on('click', function (e) {
                e.preventDefault();
                if (gitPanel.options.popap.href.val() && gitPanel.options.popap.password.val()) {
                    data = {
                        'type': 'updateConfigField',
                        'data': {
                            'repoHref': gitPanel.options.popap.href.val(),
                            'repoPassword': gitPanel.options.popap.password.val()
                        }

                    }
                    responce = gitPanel.getData(data);
                    if (responce.result) {
                        gitPanel.options.popap.form.html('Success');
                    } else {
                        alert('Error: not update; '+responce.message)
                    }
                } else {
                    if (!gitPanel.options.popap.href.val()) {
                        gitPanel.options.popap.href.css({'border-color': '#F00'}).animate({'border-color': '#000'}, 3000);
                    }

                    if (!gitPanel.options.popap.password.val()) {
                        gitPanel.options.popap.password.css({'border-color': '#F00'}).animate({'border-color': '#000'}, 3000);
                    }
                }
            })
        },

        getData: function (data) {
            $.ajaxSetup({async: false});
            var remote;
            $.post(gitPanel.options.api.url, data, function (data) {
                remote = JSON.parse(data);
            });
            return remote;
        },

        renderApplication: function () {
            gitPanel.options = Object.assign(gitPanel.options, {
                menuStructure: [
                    {
                        name: 'status',
                        icon: 'img/status.png',
                        type: 'status',
                    },
                    {
                        name: 'commits',
                        icon: 'img/commit.png',
                        type: 'commit',
                    },
                    {
                        name: 'branch',
                        icon: 'img/branch.png',
                        type: 'branch',
                    },
                    {
                        name: 'diff',
                        icon: 'img/diff.png',
                        type: 'diff',
                    },
                    {
                        name: 'settings',
                        icon: 'img/settings.png',
                        type: 'settings',
                    },
                    {
                        name: 'exit',
                        icon: 'img/exit.png',
                        type: 'exit',
                    },

                ],
            });


            html = '<header class="col-xs-1"><div class="logo clearfix">G<span>P</span></div><nav id="menu" class="menu"><ul>';
            gitPanel.options.menuStructure.forEach(function (value) {
                html += '<li data-type="' + value.type + '" data-tooltip="' + value.name + '"><img src="' + value.icon + '" alt=""></li>';
            })
            html += '</ul></nav></header><div class="body col-xs-11"><div class="wraper" id="content"></div></div>';

            gitPanel.options.body.html(html)

            gitPanel.init();
            gitPanel.options = Object.assign(gitPanel.options, {
                menu: $('#menu'),
                menuChild: 'li',
                content: $('#content'),

            });
            this.callbackApplication();
        },

        callbackApplication: function () {
            if (gitPanel.options.menu) {
                gitPanel.options.menu.on('click', gitPanel.options.menuChild, function () {
                    switch ($(this).data('type')) {
                        case 'status':
                            html = gitPanel.renderStatus();
                            parameters = {
                                title: 'Status',
                                html: html,
                                interface: [
                                    {
                                        type: 'button',
                                        data_type: 'reset',
                                        method: 'statusGitResetHead',
                                        name: 'git reset HEAD',
                                        id: 'statusBtn'
                                    },
                                    {
                                        type: 'button',
                                        data_type: 'add',
                                        method: 'statusGitAdd',
                                        name: 'git add',
                                        id: 'statusBtn'
                                    },
                                    {
                                        type: 'button',
                                        data_type: 'rm',
                                        method: 'statusGitRm',
                                        name: 'git rm',
                                        id: 'statusBtn'
                                    },
                                    {
                                        type: 'button',
                                        data_type: 'rm',
                                        method: 'statusGitRmCached',
                                        name: 'git rm --cached',
                                        id: 'statusBtn'
                                    },
                                    {
                                        type: 'button',
                                        data_type: 'checkout',
                                        method: 'statusGitCheckout',
                                        name: 'git --checkout',
                                        id: 'statusBtn'
                                    },
                                ]
                            };
                            gitPanel.renderPage(parameters);
                            gitPanel.options = Object.assign(gitPanel.options, {
                                status: {
                                    result: $('#result'),
                                    buttons: $('#statusBtn'),
                                    buttonsID: '#statusBtn'
                                }
                            });
                            gitPanel.callbackStatus();
                            break;
                        case 'branch':
                            gitPanel.options = Object.assign(gitPanel.options, {
                                branch: {
                                    resultListClass: 'js-branch-item',
                                    optionsClass: 'js-branch-item-options',
                                }
                            });
                            html = gitPanel.renderBranch();
                            parameters = {
                                title: 'Branch',
                                html: html,
                                interface: [
                                    {
                                        type: 'text',
                                        name: 'branchName',
                                        placeholder: 'Name',
                                        id: 'branchName'
                                    },
                                    {
                                        type: 'button',
                                        data_type: 'reset',
                                        method: 'branchCreate',
                                        name: 'Create branch',
                                        id: 'createBranch'
                                    }, {
                                        type: 'block',
                                        name: 'options',
                                        id: 'branchOptions',
                                        class: 'branchOptions',
                                        style: 'position:absolute; display:none;',
                                        optionsClass: 'js-branch-item-options',
                                        subInterface: [
                                            {
                                                type: 'button',
                                                method: 'branchDelete',
                                                class: 'not-active',
                                                name: 'Deleted branch',
                                                id: 'optionsBranchButton'
                                            },
                                            {
                                                type: 'button',
                                                method: 'branchCheckout',
                                                class: 'not-active',
                                                name: 'Checkout branch',
                                                id: 'optionsBranchButton'
                                            },
                                            {
                                                type: 'button',
                                                method: 'push',
                                                name: 'Push branch',
                                                id: 'optionsBranchButton'
                                            },
                                            {
                                                type: 'button',
                                                method: 'pull',
                                                class: 'onli-active',
                                                name: 'Pull branch',
                                                id: 'optionsBranchButton'
                                            },
                                            {
                                                type: 'button',
                                                method: 'pullFromMaster',
                                                class: 'onli-active',
                                                name: 'Pull from master',
                                                id: 'optionsBranchButton'
                                            },

                                        ]
                                    }
                                ]
                            };
                            gitPanel.renderPage(parameters);
                            gitPanel.options = Object.assign(gitPanel.options, {
                                branch: {
                                    result: $('#branch'),
                                    resultID: '#branch',
                                    resultListClass: 'js-branch-item',
                                    button: $('#createBranch'),
                                    text: $('#branchName'),
                                    options: $('#branchOptions'),
                                    optionsButtonsID: '#optionsBranchButton',
                                    optionsClass: 'js-branch-item-options',
                                }
                            });
                            gitPanel.callbackBranch();
                            break;
                        case 'commit':
                            html = gitPanel.renderCommit();
                            parameters = {
                                title: 'Commit',
                                html: html,
                                interface: [
                                    {
                                        type: 'textarea',
                                        id: 'commit'
                                    },
                                    {
                                        type: 'button',
                                        name: 'git commit -m',
                                        method: 'commitMessage',
                                        id: 'commitBtn'
                                    },
                                ]
                            };

                            gitPanel.renderPage(parameters);
                            gitPanel.options = Object.assign(gitPanel.options, {
                                commit: {
                                    result: $('#result'),
                                    button: $('#commitBtn'),
                                    textarea: $('#commit')
                                }
                            });
                            gitPanel.callbackCommit()
                            break;
                        case 'diff':
                            break;
                        case 'log':
                            break;
                        case 'settings':
                            break;
                        case 'exit':
                            data = {type: 'logout'};
                            responce = gitPanel.getData(data)
                            if (responce.result) {
                                gitPanel.renderLogin();
                            }
                            break;
                    }
                })
            }
        },

        renderLogin: function () {
            html = '<div class="popap-background">' +
                '</div>' +
                '<div class="popap popap-login">' +
                '<div class="popap-content">' +
                '<p class="title">Hello</p>' +
                '<p class="popap-desriptions">This is a git panel, you need to log in to work with it.</p>' +
                '<form id="authorization">' +
                '<div class="input-group">' +
                '<input id="login" type="text" class="form-control" placeholder="Username" aria-describedby="basic-addon1">' +
                '</div>' +
                '<div class="input-group">' +
                '<input id="password" type="password" class="form-control" placeholder="Password" aria-describedby="basic-addon1">' +
                '</div>' +
                '<button type="button" class="btn btn-primary">Sign in</button>' +
                '</form>' +
                '</div>';
            '</div>';

            gitPanel.options.body.html(html)
            gitPanel.options = Object.assign(gitPanel.options, {
                loginForm: $('#authorization'),
            });

            gitPanel.init();
            gitPanel.callbackLogin();
        },

        callbackLogin: function () {
            gitPanel.options.loginForm.on('click', 'button', function (e) {
                e.preventDefault();
                login = gitPanel.options.loginForm.find('#login').val();
                password = gitPanel.options.loginForm.find('#password').val();

                data = {
                    type: 'authorization',
                    data: {
                        login: login,
                        password: password
                    }
                };
                console.log(data);
                responce = gitPanel.getData(data);

                if (responce.result) {
                    gitPanel.renderApplication()
                } else {
                    if (gitPanel.options.loginForm.find("label.error").length) {
                        gitPanel.options.loginForm.find("label.error").html(responce.message);
                    } else {
                        gitPanel.options.loginForm.append('<label class="error">' + responce.message + '</label>');
                    }
                }
            })
        },

        renderStartSetings: function () {
            html = '<div class="popap-background">' +
                '</div>' +
                '<div class="popap popap-login">' +
                '<div class="popap-content">' +
                '<p class="title">Hello</p>' +
                '<p class="popap-desriptions">Before you continue, you must create a config file.</p>' +
                '<form id="configuration">' +
                '<div class="input-group">' +
                '<input type="checkbox" class="form-check-input" id="notUser" name="notUser">' +
                '<label class="form-check-label" for="notUser">Not create user</label>' +
                '</div>' +
                '<div class="input-group">' +
                '<input id="login" type="text" class="form-control" placeholder="Username" aria-describedby="basic-addon1">' +
                '</div>' +
                '<div class="input-group">' +
                '<input id="password" type="password" class="form-control" placeholder="Password" aria-describedby="basic-addon1">' +
                '</div>' +
                '<div class="input-group">' +
                '<input id="gitRepo" type="text" class="form-control" placeholder="git repository href" aria-describedby="basic-addon1">' +
                '</div>' +
                '<div class="input-group">' +
                '<input id="gitPassword" type="password" class="form-control" placeholder="git repository password" aria-describedby="basic-addon1">' +
                '</div>' +
                '<button type="button" class="btn btn-primary">Create config</button>' +
                '</form>' +
                '</div>';
            '</div>';

            gitPanel.options.body.html(html)
            gitPanel.options = Object.assign(gitPanel.options, {
                configuration: {
                    form: $('#configuration'),
                    notUser: $('#notUser'),
                    login: $('#login'),
                    password: $('#password'),
                    repoHref: $('#gitRepo'),
                    repoPassword: $('#gitPassword'),
                }
            });
            gitPanel.init();
            gitPanel.callbackStartSettings();

        },

        callbackStartSettings: function () {
            gitPanel.options.configuration.form.on('click', 'button', function () {
                if ((gitPanel.options.configuration.notUser.prop('checked') || (!gitPanel.options.configuration.notUser.prop('checked') &&
                    gitPanel.options.configuration.login.val() && gitPanel.options.configuration.password.val())) && gitPanel.options.configuration.repoHref.val() && gitPanel.options.configuration.repoPassword.val()) {

                    if (gitPanel.options.configuration.notUser.prop('checked')) {
                        data = {
                            type: 'startConfig',
                            data: {
                                notUser: true,
                                repoHref: gitPanel.options.configuration.repoHref.val(),
                                repoPassword: gitPanel.options.configuration.repoPassword.val()
                            }
                        }
                    } else {
                        data = {
                            type: 'startConfig',
                            data: {
                                notUser: false,
                                login: gitPanel.options.configuration.login.val(),
                                password: gitPanel.options.configuration.password.val(),
                                repoHref: gitPanel.options.configuration.repoHref.val(),
                                repoPassword: gitPanel.options.configuration.repoPassword.val()
                            }
                        }
                    }

                    responce = gitPanel.getData(data)
                    if (responce.result) {
                        if (data.notUser) {
                            gitPanel.renderApplication()
                        } else {
                            gitPanel.renderLogin()
                        }
                    } else {
                        if (gitPanel.options.configuration.form.find("label.error").length) {
                            gitPanel.options.configuration.form.find("label.error").html(responce.message);
                        } else {
                            gitPanel.options.configuration.form.append('<label class="error">' + responce.message + '</label>');
                        }
                    }

                } else {
                    if (gitPanel.options.configuration.form.find("label.error").length) {
                        gitPanel.options.configuration.form.find("label.error").html('Error: You have not filled in the data');
                    } else {
                        gitPanel.options.configuration.form.append('<label class="error">Error: You have not filled in the data</label>');
                    }

                }

            });

            gitPanel.options.configuration.notUser.on('change', function () {
                if ($(this).prop('checked')) {
                    gitPanel.options.configuration.login.attr('disabled', 'disabled');
                    gitPanel.options.configuration.password.attr('disabled', 'disabled');
                } else {
                    gitPanel.options.configuration.login.removeAttr('disabled', 'disabled');
                    gitPanel.options.configuration.password.removeAttr('disabled', 'disabled');
                }
            });
        }

    }

});

