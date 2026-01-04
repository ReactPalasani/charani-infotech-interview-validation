import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: "charani-d9e7e",
      clientEmail: "firebase-adminsdk-fbsvc@charani-d9e7e.iam.gserviceaccount.com",
      privateKey:  "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC/b5GtOv37rgb2\nmuw2RrL2MNbY0lmll20YfTQZJhutAO3RJeRW6nROysSs1zU5CEDU8W303ilC+Tl8\nNRELGQSc8meBgtIWXz8z7h9btSnRfkTA/MjOpGgVT571k8CtxhcXbMBvvsp8AsWw\n1NOdRlUr+7SgujKnc3JMur/p4FseegiSQrpJbn/A/kR6CWWnTW8Q793k1wxaxtYz\ngaCjfM289mvU4TdU1pQj6SHvz4LjNBVjT5IE53luJvuGpInWJ+BrusNrWv+XZ8+u\nlFm4O+MVr2bwdkLYQ1T3VWvdRNmN/EP9SHv2WrwgMdT3tdbwQihGiQqEx31SlIz+\nc+/iXDuvAgMBAAECggEADvIKaQBUiNwezgztSRV+7kqE03ukpRFr4oAP27DGc1zB\ntFTlfUWjm+0nqqjIjnHPAfDxWS8pAIINk11fPcMPwaMJIqrQdQ+tkwPRreq4X5Mg\nkgKKONvMBnHnYpvM7KQs9Fa4tWCrVUAwJ+yNstclWiA2C2BOCRWxxDzGM9+grYHN\n7QWO8GcQjkDcuzLTStV0oEr4O5KQ9/Rin8Eu6iQeoBUZEJubXQ2oqoDEVCSMnTFf\n7czU7Q2TMACk06nsikwiWriMrwyvLi5t5MJDDtODzaAwrDZtI8RvwSXQWX6FTS0I\n18gbJfyzZoMJiu1l81uA7aIRu79P3o4/0TFHVt0K5QKBgQDfrtLLjf1kNOLKkHNV\n/iYquiEtnb3TCXCXGz7ybJF7nrIBl4uhnpxJ2dyLvC9S/ND5sZ2vIhDsXHRefEwI\n/XG1BMiYip9bOiQdtJu1ZaumuIJeX/jqoRDWX/JqGxxeJWTocoJRRfATbTFuzE8E\njuvXgUpFc4xorQrf5ps8PoZhYwKBgQDbGAyKpAaP1fyn6nV9RxlVnQz0cnz9c2R6\nLZwVSzTVLDcy12fy5Huy7X0/RZGwecnY6iuiGPmc7RTDmfTTMRaaVdBmMD5x6VrO\nqWIl7oQyMzKSg3nMr4Ar59acbHsmFyTNp38L8D4owEnr8BBk0Up+Pqc/dcwZVNoJ\nlZPgyerURQKBgQCV6MKZbVXPHKqJ+3lwvl2x8QBfZAJeN0tf2gC71AtEgDzoWDpa\nXMR9sibe94X35jvfvCvjvb79yZCr6j3DIKheGxCdOvpF15dw2SQp1DPQDoRA360h\nAkUYh0Ed34GJjyIrruKruWWGf33Ltd2XPnnM+ndeSGxnkuFg4VpUa8r/5QKBgQDE\nsuSfm/9gJ0e8IVz16l0uZd95n0fj7DNrFYOqAmkecaHk/UsP4F3GGD14Dqdr/wte\nuW4PC8keQCOCMLiC2vFmAmElPW7yqgSiwaOiVm9M+nYO4Ab74xx5Tp14tlQhsGmU\nUSpYt4m24Fv9fPva56Ovj+RrrwBcRbezHx0ylVVE2QKBgCsdmDzOEaMmKcC1bx0k\niNnfDKETOi5lTNdZIFJF6Ld5pp+vmW1hsezM/Ct95msrdZLzbwWvnFnDHuUGk9Gp\nCPFF+JrtzCObYBp9DmGvwGq09xf+/mSm812vmnASRi63QivkNqFuEsUz36m/xU82\nBJ6BZ/UKFPIy6GPbPP0UFQI/\n-----END PRIVATE KEY-----\n",
    }),
    databaseURL: "https://charani-d9e7e-default-rtdb.asia-southeast1.firebasedatabase.app/",
  });
}

export const db = admin.database();
