//
//  FontsManager.swift
//  Fonts
//
//  Created by Emiaostein on 6/29/15.
//  Copyright (c) 2015 Emiaostein. All rights reserved.
//

import Foundation
import CoreText

final class FontsManager {
    
    private var fontsList = [String]()
    
    let fontsURL = NSBundle.mainBundle().bundleURL.URLByAppendingPathComponent("Font")
   static let share = FontsManager()
    
    func registerFontWithURL(url: NSURL) -> Bool {
        
        let fontData = NSData(contentsOfURL: url)
        if fontData == nil {
            return false
        }
        
        let providerRef = CGDataProviderCreateWithCFData(fontData)
        let font = CGFontCreateWithDataProvider(providerRef)
        if CTFontManagerRegisterGraphicsFont(font!, nil) {
            return true
        } else {
            return false
        }
    }
    
    func getFontsList() -> [String] {
        return fontsList
    }
    
    func registerLocalFonts() {
        
        let fileManger = NSFileManager.defaultManager()
        
        let entries = fileManger.enumeratorAtURL(fontsURL, includingPropertiesForKeys: nil, options: [.SkipsPackageDescendants, .SkipsHiddenFiles]) { (url, error) -> Bool in
            return true
        }
        
        while let url = entries?.nextObject() as? NSURL {
            
            var flag = ObjCBool(false)
            fileManger.fileExistsAtPath(url.path!, isDirectory: &flag)
            if flag.boolValue == false {
                // file that is not directory
                if url.pathExtension == "info" {
                    
                    let infoData = NSData(contentsOfURL: url)
                    let json = try! NSJSONSerialization.JSONObjectWithData(infoData!, options: NSJSONReadingOptions(rawValue: 0)) as! [String: String]
                    
                    let dir = json["fileDIR"]
                    let name = json["fileName"]
                    let fontURL = fontsURL.URLByAppendingPathComponent(dir!).URLByAppendingPathComponent(name!)
                    if registerFontWithURL(fontURL) {
                        let name = json["regularName"]!
                        fontsList.append(name)
                    }
                }
            }
        }
    }
}