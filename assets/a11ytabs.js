;(function ( $, w, doc ) {

  'use strict';

  var a11yTabs = {};

  a11yTabs.NS = "a11yTabs";
  a11yTabs.AUTHOR = "Scott O'Hara";
  a11yTabs.VERION = "1.0.4";
  a11yTabs.LICENSE = "https://github.com/scottaohara/accessible-components/blob/master/LICENSE.md";

  var tabWidget = '[data-action="a11y-tabs"]';

  // define the plug-in
  $.fn.extend({

    a11yTabs: function ( e ) {

      // setup global class variables
      var tabList             = '.js-tabs__list',
          tabBtn              = '.js-tabs__list__item',
          tabPanelContainer   = '.js-tabs__panel-container',
          tabPanel            = '.js-tabs__panel',
          tabDefault          = '.js-show-by-default',
          tabDEF              = tabDefault.split('.')[1];

      return this.each( function () {

        // set up variables specific to the each instance
        var id = this.id,
            $self = $('#' + id),


        /*

          Generate TabList

          In certain situations, it may be desirable to have a tab widget
          interface, but getting full access to a code base may not
          be possible. (working in a CMS for example)

          This function exists so that the required markup to get
          a tab widget up and running can be reduced to simply the
          tabWidget, tabPanelContainer, and the tabPanels

        */
        genTabList = function () {

          // determine if a tab component needs a generated tablist
          if ( !$self.find(tabList).length ) {

            // start a counter to number the panels in this widget
            var $panelNum = 1;

            // The tablist wasn't there, so let's add it in
            $self.prepend('<ul class="tab-list js-tabs__list" />');


            // now we need to cycle through all the existing panels to pull out
            // the necessary information to populate the tablist with tabs
            $self.find(tabPanel).each( function () {

              var $this = $(this);

              // create unique IDs for the panels, cause we'll need 
              // them later when the aria-controls are set up.
              $this.attr('id', id + '_panel_' + $panelNum );

              // Now store the generated ID
              var $grabID = $this.attr('id'),
                  // create the tab label based off from a data 
                  // attribute on the panel,
                  // OR the first heading (h1-h6) in the tab
                  // OR just call it Tab + # cause lol naming stuff
                  $grabLabel = $this.attr('data-tab-label') || $this.find(':header:first-child').text() || 'Tab' + $panelNum,

                  // Put it all together as a new <li>tab</li>
                  $createTabItem = '<li><a href="#'+$grabID+'" class="tab-list__item '+tabBtn.split('.')[1]+'">'+$grabLabel+'</a></li>';

              // Now append it to the tablist and repeat!
              $self.find(tabList).append($createTabItem);

              // add one to the number of panels and 
              // start all over again
              return $panelNum = $panelNum + 1;

            }); // end $self.find(tabPanel).each

          } // end if 
 
        }, // end genTabList()


        /**

          Setup Tab List & Tabs

        */
        tabsSetup = function () {

          var $tabItems = $(tabList + ' li'),
              $tabBtns = $self.find(tabBtn);

          // set up the appropriate aria-role for the tablist, and
          // give it a unique ID based on the a11y tabs component ID
          $self.find(tabList).attr({
            'role': 'tablist',
            'id': id + '_tablist'
          })
            // set the <li>s within the tab menu to have a
            // presentation role, to cut down on the verbose
            // audio declarations of list elements when using
            // voice over
            .find($tabItems).attr({
              'role': 'presentation'
            });


          // for each tab item (link/button) within this tab menu,
          // take the href and use it to apply the appropriate
          // aria-attributes
          // set aria-selected
          $tabBtns.each( function () {

            var $this = $(this),
                $getID = $this.attr('href').split('#')[1];

            $this.attr({
              'aria-controls': $getID,
              'id': $getID + '_tab',
              'aria-selected': 'false',
              'tabindex': '-1',
              'role': 'tab'
            });
          });

          // Normally the first item in a tab list should be activated
          // and its panel displayed.  js-show-by-default is how this is
          // set, because this class can also be added manually to a 
          // tab, and it will instead be the tab that's shown by default
          if ( $self.find(tabDefault).length === 0 ) {
            $self.find(tabList + ' > li:first-child >').addClass(tabDEF);
          }

          // update the default tab with the appropriate attribute values
          $(tabDefault).attr({
            'aria-selected': 'true',
            'tabindex': '0'
          });

        },


        /**

          Setup Tab Panels

        */
        panelsSetup = function () {

          // check to make sure a tab-panel-container is part of the mark-up. 
          // if not, then wrap all the tab panels in it.
          if ( !$self.find(tabPanelContainer).length ) {
            $self.find(tabPanel).wrapAll('<div class="tab-panel-container '+tabPanelContainer.split('.')[1]+ '" />')
          }

          // give the tab panel container a unique ID based off the
          // main ID of the a11y tabs component.
          $self.find(tabPanelContainer).attr({
            'id': id + '_tpc'
          });


          // find all the panels
          $self.find(tabPanel).each( function () {

            var $this = $(this);

            // set their attributes
            $this.attr({
              'aria-labelledby': $this.attr('id')+'_tab',
              'aria-hidden': 'true',
              'role': 'tabpanel'
            });

            // check to make sure the correct panel is shown by default,
            // which is determined by the tab with the js-show-by-default class
            if ( $( '#'+ $this.attr('id')+'_tab' ).hasClass(tabDEF) ) {
              $this.attr('aria-hidden', 'false');
            }

          }); // end $self.find(tabPanel).each
        },


        /**

          Show Active Tab

        */
        tabsShow = function ( e ) {

          var $targetTab = $(this).find( e.target ),
              $notTargetTab = $targetTab.closest(tabList).find(tabBtn),
              $targetPanel = $('#' + $targetTab.attr('aria-controls') );

          // stop the uri to be added to the browser address bar,
          // and any browser jumping
          e.preventDefault();

          // hide the tabs again
          $notTargetTab.attr({
            'aria-selected': 'false',
            'tabindex': '-1'
          }).removeAttr('aria-live').removeClass(tabDEF);

          // activate the selected
          $targetTab.attr({
            'aria-selected': 'true',
            'tabindex': '0',
            'aria-live': 'polite'
          });

          // reset panels to hidden and reveal the newly selected panel
          $targetPanel.closest(tabPanelContainer).find('> ' + tabPanel).attr('aria-hidden', 'true');
          
          // reveal the currently targeted panel
          $targetPanel.attr('aria-hidden', 'false');

        },



        // make sure tabs function as expected by keyboard users
        // this makes sure that navigating through tabs is set to act
        // like navigating through radio buttons with a keyboard,
        // as a keyboard user should not have to keyboard tab through
        // undesired navigation tabs to get to content
        keytrolls = function ( e ) {

          var $eTarget = $(e.target),
              $currentTab,
              $currentTabList,
              $currentPanel,
              $tabListRole = '[role="tablist"]',
              keyCode = e.which;

          if ( $eTarget.attr('role') === 'tab' ) {
            $currentTab = $(e.target).parent();
            $currentTabList = $currentTab.closest($tabListRole);
          }
          else if ( $(e.target).closest(tabPanel) ) {
            $currentPanel = $(e.target).closest(tabPanelContainer);
            $currentTabList = $currentPanel.closest(tabWidget).find('> ' + $tabListRole);
            $currentTab = $currentTabList.find('[aria-selected="true"]').parent();
          }


          //now that we know our current tablist, we can declare these vars
          var $firstTab = $currentTabList.find('li:first-child').children(),
              $lastTab = $currentTabList.find('li:last-child').children(),
              $prevTab = $currentTab.prev().children(),
              $nextTab = $currentTab.next().children();

          // if the current tab is the first or last tab, 
          // then update prev and next values
          if ( $currentTab.is(':first-child') ) {
            $prevTab = $lastTab;
          }
          else if ( $currentTab.is(':last-child') ) {
            $nextTab = $firstTab;
          }


          // depending on our e.target, define our keyboard controls
          if ( $(e.target).attr('role') === 'tab' ) {

            switch ( keyCode ) {

              case 39: // right
              case 40: // down
                e.preventDefault();
                $nextTab.focus();
                break;

              case 37: // left
              case 38: // up
                e.preventDefault();
                $prevTab.focus();
                break;

              case 13: // enter (return) key
              case 32: // space bar
                e.preventDefault();
                $(e.target).trigger('click');
                break;

              default:
                break;

            } // end switch

          }
          else if ( $(e.target).closest(tabPanel) ) {

            if ( e.ctrlKey ) {
              e.preventDefault(); // prevent default behavior

              switch ( e.keyCode ) {

                case 38: // up
                  $currentTab.children().eq(0).focus();
                  break;

                case 33: // pg up
                  setTimeout(function () {
                    $prevTab.focus().click();
                  }, 10);

                  break;

                case 34: // pg down
                  setTimeout(function () {
                    $nextTab.focus().click();
                  }, 10);
                  break;

                default:
                  break;

              } // end switch

            } // end e.ctrlKey if

          } // end else if

        }; // end keytrolls


        // run setups on load
        genTabList();
        tabsSetup();
        panelsSetup();


        // Events
        $self.find(tabBtn).on( 'click', tabsShow.bind(this) );
        $self.find(tabBtn).on( 'keydown', keytrolls.bind(this) );
        $self.find(tabPanel).on( 'keydown', keytrolls.bind(this) );

      }); // end: return this.each()

    } // end a11yTabs function

  }); // end $.fn.extend

  // call it

  $(tabWidget).a11yTabs();

})( jQuery, this, this.document );



/*

  Expected Minimum Mark-up


  <!--

    The parent container MUST have:
      data-action="a11y-tabs"
      id="a_unique_id_goes_here"

    These two attributes are absolutely necessary for the plug-in to
    even recognize this as a tab widget.

    All classes without the prefix of 'js-' are for styling purposes,
    while the 'js-' classes are required as plug-in hooks.

    If not hard coded, a tablist will be generated. It will first look
    to see if a tab-panel has a data-tab-label set. If not, it will
    then look to see if there is a immediate heading for the tab panel
    (there should be since these are sections and they require a heading h2-h6).
    If neither of those are available, then a label will be generated based
    on the order of the panel. e.g. Panel number 3 gets a tab titled 'Tab 3'.

  -->


  <div class="tab-container" data-action="a11y-tabs" id="unique_id">

    <div class="tab-panel-container js-tabs-panel-container">
      <section class="tab-panel js-tabs__panel" data-tab-label="Yo">
        <h2>Heading of Panel 1</h2>
        <p>
          ...
        </p>
      </section> <!-- /.tab-panel -->
      <section class="tab-panel js-tabs__panel" data-tab-label="tab 2">
        <h2>Heading of Panel 2</h2>
        <p>
          ...
        </p>
      </section> <!-- /.tab-panel -->
      <section class="tab-panel js-tabs__panel" data-tab-label="tab 3">
        <h2>Heading of Panel 3</h2>
        <p>
          ...
        </p>
      </section> <!-- /.tab-panel -->
    </div> <!-- /.tab-panel-container -->

  </div> <!-- /.tab-container -->

*/
