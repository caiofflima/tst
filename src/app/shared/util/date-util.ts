export class DateUtil {

    static minus(bigger: Date, smaller: Date): number {
        return bigger.getFullYear() - smaller.getFullYear();
    }

    static getIdade(birthDate: Date): number {
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();

        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }
}
