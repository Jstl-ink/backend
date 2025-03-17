/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* Get page by pageId
* Returns a single page
*
* pageId String ID of order that needs to be fetched
* returns Page
* */
const getPageById = ({ pageId }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        id: pageId,
        name: 'Test Pirate 🏴‍☠️',
        bio: "Yar Pirate IpsumProw scuttle parrel provost Sail ho shrouds spirits boom mizzenmast yardarm. Pinnace holystone mizzenmast quarter crow's nest nipperkin grog yardarm hempen halter furl. Swab barque interloper chantey doubloon starboard grog black jack gangway rutters.Deadlights jack lad schooner scallywag dance the hempen jig carouser broadside cable strike colors. Bring a spring upon her cable holystone blow the man down spanker Shiver me timbers to go on account lookout wherry doubloon chase. Belay yo-ho-ho keelhaul squiffy black spot yardarm spyglass sheet transom heave to.Trysail Sail ho Corsair red ensign hulk smartly boom jib rum gangway. Case shot Shiver me timbers gangplank crack Jennys tea cup ballast Blimey lee snow crow's nest rutters. Fluke jib scourge of the seven seas boatswain schooner gaff booty Jack Tar transom spirits.",
        img: 'https://unsplash.com/photos/QO1TfIj9c2I/download?ixid=M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNzQyMTU3MDgzfA&force=true',
        socialLinks: [
          { name: 'Instagram', link: 'https://www.instagram.com' },
          { name: 'Twitter', link: 'https://www.twitter.com' },
        ],
        links: [
          { name: 'My Bay', link: 'https://de.wikipedia.org/wiki/The_Pirate_Bay' },
          { name: 'Loot here', link: 'https://maps.app.goo.gl/PvTNEktJsyqQVHuv6' },
          { name: 'Avoid these guys 🏴󠁧󠁢󠁥󠁮󠁧󠁿', link: 'https://pirates.fandom.com/wiki/Royal_Marines' },
          { name: 'Get your own island 🏝️', link: 'https://www.privateislandsonline.com/' },
        ],
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);

module.exports = {
  getPageById,
};
