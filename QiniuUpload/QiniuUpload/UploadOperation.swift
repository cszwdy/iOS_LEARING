//
//  UploadOperation.swift
//  
//
//  Created by Emiaostein on 6/19/15.
//
//

import UIKit

class UploadOperation: NSOperation {
    
    let token: String
    let key: String
   
    init(aToken: String, aKey: String) {
        
        token = aToken
        key = aKey
        super.init()
    }

}

// MARK: - NSoperation override method
extension UploadOperation {
    
}
