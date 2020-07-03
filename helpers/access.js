const userIsAdmin = ({ authentication: { item: user } }) => Boolean(user && user.isAdmin);
const userIsModerator = ({ authentication: { item: user } }) => Boolean(user && user.role == 'moderator');
const userIsEditor = ({ authentication: { item: user } }) => Boolean(user && user.role == 'editor');
const userIsContributor = ({ authentication: { item: user } }) => Boolean(user && user.role == 'contributor');
const userIsNotContributor = ({ authentication: { item: user } }) => Boolean(user && user.role != 'contributor');

const userOwnsItem = ({ authentication: { item: user }, listKey }) => {
    if (!user) return false;

    if (listKey == 'User')
        return { id: user.id };

    return { createdBy: { id: user.id } };
};

const userIsAdminOrModeratorOrOwner = auth => {
    const isAdmin = userIsAdmin(auth);
    const isModerator = userIsModerator(auth);
    const isOwner = userOwnsItem(auth);
    return isAdmin || isModerator || isOwner;
};

const userIsAdminOrModerator = auth => {
    const isAdmin = userIsAdmin(auth);
    const isModerator = userIsModerator(auth);
    return isAdmin || isModerator;
};

/*const userIsAboveAuthor = auth => {
    const isAuthor = userIsAuthor(auth);
    const isContributor = userIsContributor(auth);
    return !(isAuthor || isContributor);
}

const userIsAboveAuthorOrOwner = auth => {
    const isAboveAuthor = userIsAboveAuthor(auth);
    const isOwner = userOwnsItem(auth);
    return isAboveAuthor || isOwner;
} */

const access = {
    userIsAdmin,
    userIsModerator,
    userIsEditor,
    userIsContributor,
    userIsNotContributor,
    userOwnsItem,
    userIsAdminOrModeratorOrOwner,
    userIsAdminOrModerator
};

module.exports = access
