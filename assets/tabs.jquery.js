;(function ( $, w, doc ) {

  'use strict';

  var a11yTabs = {};

  a11yTabs.NS = "a11yTabs";
  a11yTabs.AUTHOR = "Scott O'Hara";
  a11yTabs.VERION = "1.0.1";
  a11yTabs.LICENSE = "https://github.com/scottaohara/accessible-components/blob/master/LICENSE.md";

  // define the plug-in
  $.fn.extend({

    a11yTabs: function ( e ) {

      // setup global class variables
      var tabMenu     = '.js-a11y-tabs',
          tabBtn      = '.js-tab-item',
          tabPanel    = '.js-tab-panel',
          tabDefault  = '.js-tab-item--default';

      return this.each( function () {

        // set up variables specific to the each instance
        var id = this.id,
            $this = $(this),
            $self = $('#' + id),


        tabsSetup = function () {
          var $tabItems = $(tabMenu + ' li'),
              $tabBtns = $self.find($(tabBtn));


          // the tab menu should be set to display none by
          // default, in the instance of there being no JS,
          // this menu wouldn't function, so don't show it.
          $this.attr({
            'role': 'tablist',
            'aria-hidden': 'false'
          })
           // set the <li>s within the tab menu to have a role
          // of presentation, to cut down on the verbose
          // audio declarations of list elements when using
          // voice over
          .find($tabItems).attr('role', 'presentation');

          // for each tab button within this tab menu,
          // take the href and use it to apply the appropriate
          // aria-attributes
          $tabBtns.each( function () {
            var $this = $(this),
                $getID = $this.attr('href').substring(1);

            $this.attr({
              'aria-controls': $getID,
              'id': $getID + '_tab',
              'aria-selected': 'false',
              'tabindex': '-1',
              'role': 'tab'
            });

            // look to see if the default tab has  been set
            if ( !$this.hasClass('js-tab-item--default') ) {
              // if not, set it to the first tab item
              $this.closest( $self ).find('li').first().children().addClass('js-tab-item--default');
            }
            else {
              // if it has been set, reset the first tab back to the default
              // settings
              $this.closest( $self ).find('li').first().children().removeClass('js-tab-item--default').attr({
                'tabindex': '-1',
                'aria-selected': 'false'
              });
            }

            // update the default tab with the appropriate attribute values
            $(tabDefault).attr({
              'tabindex': '0',
              'aria-selected': 'true'
            });

          });
        },

        panelsSetup = function () {
          // find all the panels
          $(tabPanel).each( function () {
            var $this = $(this);

            // set their attributes
            $this.attr({
              'aria-labelledby': $this.attr('id')+'_tab',
              'aria-hidden': 'true',
              'role': 'tabpanel'
            });

            // check to make sure the correct panel is shown by default,
            // which is determined by the tab with the js-tab-item--default class
            if ( $( '#'+ $this.attr('id')+'_tab' ).hasClass('js-tab-item--default') ) {
              $this.attr('aria-hidden', 'false');
            }

          });
        },

        tabsShow = function ( e ) {
          var $targetTab = $self.find( e.target ),
              $targetPanel = $('#' + $targetTab.attr('aria-controls') );

          // hide the tabs again
          $self.find($(tabBtn)).attr({
            'aria-selected': 'false',
            'tabindex': '-1'
          }).removeAttr('aria-live');

          // activate the selected
          $targetTab.attr({
            'aria-selected': 'true',
            'tabindex': '0',
            'aria-live': 'polite'
          });

          // reset panels to hidden
          $targetPanel.parent().children().attr('aria-hidden', 'true');
          $targetPanel.attr('aria-hidden', 'false');
          $targetPanel.children().focus();

          e.preventDefault();
        },

        // make sure tabs function as expected by keyboard users
        tabsKeytrols = function ( e ) {

          var $currentTabItem = $self.find( $(tabBtn).parent() );

          var $tabPrev = $currentTabItem.prev() ?
                         $currentTabItem.prev().children().eq(0) :
                         $currentTabItem.last().children().eq(0),

              $tabNext =  $currentTabItem.next() ?
                          $currentTabItem.next().children().eq(0) :
                          $currentTabItem.first().children().eq(0);


          switch ( e.keyCode ) {
            case 39: // right
            case 40: // down
              $tabNext.focus();
              break;

            case 37: // left
            case 38: // up
              $tabPrev.focus();
              break;

            case 32:
              e.preventDefault();
              tabsShow.bind(this);
              break;

            default:
              break;
          }

        };

        // run setups on load
        tabsSetup();
        panelsSetup();

        // Events
        $self.find($(tabBtn)).on('click', tabsShow.bind(this) );
        $self.find($(tabBtn)).on('keydown', tabsKeytrols.bind(this) );

      }); // end: return this.each()

    } // end a11yTabs function

  }); // end $.fn.extend

  // call it bro
  $('.js-a11y-tabs').a11yTabs();

})( jQuery, this, this.document );



/*

  Expected Mark-up

<!--
  .tab-container is here for styling purposes / to group the
  tab components together.  It is actually not required by the JS.
-->
<section class="tab-container">

  <!--

    the main tab list MUST have:
      [id]
      [aria-hidden="true"]
      [class="js-a11y-tabs"]

    Each link within the tab list must have a unique href,
    setup as '#uniqueNameHere' which can not match any other IDs
    on the page. The links must also have a class of "js-tab-item"
  -->
  <ul class="tab-menu js-a11y-tabs clearfix" aria-hidden="true" id="uniqueID">
    <li>
      <a href="#panelA"
         class="tab-menu__item js-tab-item">
         Common Filters
      </a>
    </li>
    <li>
      <a href="#panelB"
         class="tab-menu__item js-tab-item js-tab-item--default">
         Search for Concepts
      </a>
    </li>
  </ul>


  <!--

  -->
  <div class="tab-panel-container">
    <section id="panelA"
             class="tab-panel js-tab-panel">
      main content section 1
    </section>
    <section id="panelB"
             class="tab-panel js-tab-panel">
      two
    </section>
  </div>

</section> <!-- end .tab-container -->




*/
