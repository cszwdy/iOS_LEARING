//
//  UpLoadManager.swift
//  QiniuUpload
//
//  Created by Emiaostein on 6/21/15.
//  Copyright (c) 2015 BoTai Technology. All rights reserved.
//

import Foundation
import Qiniu

final class UpLoadManager {
    
    typealias UploadCompletedBlock = ([String : Bool], Bool) -> Void  //results, completed
    private var canceled = false
    private var completeCount = 0
    private var results = [String : Bool]()
    private let token: String // token
    private let fileKeys: [String : String] // [key : filePath]
    private let completeHandler: UploadCompletedBlock
    private let uploadMananger = QNUploadManager.sharedInstanceWithConfiguration(nil)

    init(aFileKeys: [String : String], aToken: String, aCompleteHandler: UploadCompletedBlock) {
        fileKeys = aFileKeys
        token = aToken
        completeHandler = aCompleteHandler
    }
    
    func cancel() {
        canceled = true
    }
    
    func start() {
        let cancelSignal = {[unowned self] () -> Bool in
            return self.canceled
        }
        
        let defaultOptions = QNUploadOption.defaultOptions()
        let customOptions = QNUploadOption(mime: defaultOptions.mimeType, progressHandler:defaultOptions.progressHandler, params: defaultOptions.params, checkCrc: defaultOptions.checkCrc, cancellationSignal: cancelSignal)
        
        let totalCount = fileKeys.count
        for (key, filePath) in fileKeys {
            results[key] = false
            uploadMananger.putFile(filePath, key: key, token: token, complete: { (ResponseInfo, key, response) -> Void in
                self.results[key] = (response != nil) ? true : false
                self.completeCount++
                if self.completeCount == totalCount {
                    var results = self.results
                    let successes = results.values.array.reduce(true, combine: { (now, next) -> Bool in
                        return now && next
                    })
                    self.completeHandler(self.results, successes)
                }
                
                }, option: customOptions)
        }
    }
}
