// function permutation(str: string) {
// 	function R(set: Set<string>): Array<string> {
// 		if (set.size === 1) {
// 			return set.values().next().value
// 		}
// 		return flattern([...set].map((char) => 
// 			R(remove(set, char)).map((perm) => char + perm)
// 		))
// 	}
// 	return R(new Set([...str]));
// }
// function remove<T>(set: Set<T>, i: T) {
// 	const newSet = new Set<T>([...set])
// 	newSet.delete(i)
// 	return newSet
// }
function flattern(array) {
    var _a;
    if (!Array.isArray(array)) {
        return array;
    }
    return (_a = []).concat.apply(_a, array.map(flattern));
}
flattern([1, 2, 3, [4, 5, [6]]]);
